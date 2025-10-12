import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import type { createLinkArgs } from "types/types";
import { useAuth } from "~/zustand/store";
import axios from 'axios'
import { useUploadProgressStore } from "~/zustand/progress-store";
import { useUploadStatusStore } from "~/zustand/upload-status-store";

const backendUrl = import.meta.env.VITE_BACKEND_APP_URL

export function useGoogleLoginHandler() {

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleGoogleLogin = useCallback(async (token: string | undefined) => {
        if (!token) {
            console.log("Google token not found.");
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/api/v1/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
                credentials: 'include'
            });

            if (!res.ok) {
                const error = await res.json();
                console.log(error?.message || "Google login failed.")
                return;
            }

            const data = await res.json();
            useAuth.getState().setUser(data.user);
            navigate(from, { replace: true });

        } catch (err) {
            console.error("Login error:", err);
        }

    }, [navigate, from]);

    return handleGoogleLogin;
}

export const authCheck = async () => {
    try {
        const res = await fetch(`${backendUrl}/api/v1/auth/check`, {
            method: "GET",
            credentials: 'include'
        });

        if (!res.ok) {
            useAuth.getState().logout()
            useAuth.getState().setUser(null)
        }

        const data = await res.json();
        useAuth.getState().setUser(data.user);
    } catch (err) {
        console.error("Login error:", err);
    }
}


export const logout = async () => {
    try {
        const res = await fetch(`${backendUrl}/api/v1/auth/logout`, {
            method: "GET",
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error("Logout failed");
        }

        useAuth.getState().logout()
        useAuth.getState().setUser(null)
    } catch (err) {
        console.error("Logout error:", err);
    }
}

const fetchValidateToken = async (token: string) => {
    const res = await fetch(`${backendUrl}/api/v1/link/validate?token=${token}`, {
        method: "GET",
        credentials: 'include',
    });
    if (!res.ok) {
        throw new Error("Invalid or expired token");
    }

    return res.json();
};

export function useValidateTokenQuery(token: string) {
    return useQuery({
        queryKey: ["validate-token", token],
        queryFn: () => fetchValidateToken(token),
        enabled: !!token,
        retry: false,
    });
}


const fetchUserLinks = async ({ page = 1, searchQuery = '', limit = 10 }) => {
    const res = await fetch(`${backendUrl}/api/v1/link?page=${page}&limit=${limit}&query=${searchQuery}`, {
        method: "GET",
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user links");
    }

    return res.json();
};
export function useUserLinksQuery(page: number, searchQuery: string, limit: number = 10) {
    return useQuery({
        queryKey: ["user-links"],
        queryFn: () => fetchUserLinks({ page, searchQuery, limit }),
        staleTime: Infinity,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        retry: false,
    });
}


const uploadFiles = async ({ formData, token }: { formData: FormData; token: string }) => {

    const res = await fetch(`${backendUrl}/api/v1/file?token=${token}`, {
        method: "POST",
        body: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error("Failed to upload files");
    }

    return res.json();
};

export function useUploadFilesMutation() {
    return useMutation({
        mutationFn: uploadFiles,
    });
}


const uploadToS3 = async ({ encryptFile, url, type, name }: { encryptFile: Blob, url: string, type: string, name: string }) => {
    const { updateProgress, updateStatus } = useUploadStatusStore.getState();

    try {
        // const s3Response = await fetch(url, {
        //     method: 'PUT',
        //     headers: {
        //         "Content-Type": type,
        //     },
        //     body: encryptFile
        // })
        // if (!s3Response.ok) {
        //     throw new Error("Failed to upload to S3");
        // }
        // return true

        const res = await axios.put(url, encryptFile, {
            headers: {
                'Content-Type': type
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent?.total || 1));
                useUploadProgressStore.getState().setProgress(percentCompleted)
                updateProgress(name, percentCompleted);
                updateStatus(name, "uploading");
            }
        })
        if (!(res.status >= 200 && res.status < 300)) {
            throw new Error("Failed to upload to S3");
        }

        return true
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw error;
    }
}


export function useUploadS3Mutation() {
    return useMutation({
        mutationFn: uploadToS3,
    });
}



const fetchUserFiles = async (linkId: number, token: string, page: number, limit: number) => {
    const res = await fetch(
        `${backendUrl}/api/v1/file/${linkId}/${token}/files?page=${page}&limit=${limit}`, {
        method: "GET",
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user files");
    }

    return res.json();
}

export function useUserFilesQuery(linkId: number, token: string, page: number, limit: number) {
    return useQuery({
        queryKey: ["user-files"],
        queryFn: () => fetchUserFiles(linkId, token, page, limit),
        enabled: !!token
    });
}


export const getUploadUrl = async (mimeType: string, token: string | null, fileSize: number) => {
    try {
        const res = await fetch(`${backendUrl}/api/v1/file/upload-url?token=${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mimeType, fileSize }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data?.error || "Failed to get upload URL");
        }

        return data;
    } catch (error) {
        console.log('got error during getting upload pre-signed url', error)
        throw error
    }
};


const updateS3UpoadDB = async ({ s3Key, size, token, filename }: { s3Key: string, size: number, token: string | null, filename: string }) => {
    try {
        const res = await fetch(`${backendUrl}/api/v1/file/notify-upload?token=${token}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                s3Key,
                fileSize: size,
                name: filename
            }),
        });
        if (!res.ok) {
            throw new Error("got error while uodating db for s3 upload")
        }

    } catch (error) {
        console.log("got error while uodating db for s3 upload")
        throw error;
    }
}

export const useUpdateS3UploadDB = () => {
    return useMutation({
        mutationFn: updateS3UpoadDB,
    });
}



const createLink = async ({ payload, navigate, secretKey, iv }: createLinkArgs) => {
    try {
        const res = await fetch(`${backendUrl}/api/v1/link`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        if (res.status === 401) {
            useAuth.getState().setUser(null)
            navigate('/auth')
            return;
        }
        const result = await res.json();
        if (result.error) {
            console.error('err', result.error);
            throw result.error;
        }
        return result;
    } catch (error) {
        console.log("got error during creating link ")
        throw error;
    }
}

export function useCreateLinkMutation() {
    // const navigate = useNavigate();
    return useMutation({
        mutationFn: createLink,
    });
}


const fetchStorageUsed = async () => {
    try {
        const res = await fetch(`${backendUrl}/api/v1/file/storage-used`, {
            method: "GET",
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error("Failed to fetch storage used");
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching storage used:", error);
        throw error;
    }
};

export function useStorageUsedQuery() {
    return useQuery({
        queryKey: ["storage-used"],
        queryFn: fetchStorageUsed,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        retry: false,
    });
}

const deleteLink = async (id: number) => {
    try {
        const res = await axios.delete(`${backendUrl}/api/v1/link/${id}`, {
            withCredentials: true
        })
        return await res
    } catch (error) {
        console.log("got error during deleting link")
        throw error
    }
}

export function useDeleteLink() {
    return useMutation({
        mutationFn: deleteLink,
    })
}

const linkCoumt = async () => {
    try {
        const res = await fetch(`${backendUrl}/api/v1/link/count`, {
            method: "GET",
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error("Failed to fetch link count");
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching link count:", error);
        throw error;
    }
}

export function useLinkCount() {
    return useQuery({
        queryKey: ["link-count"],
        queryFn: linkCoumt,
        // staleTime: Infinity,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        retry: false,
    })
}

export const checkoutPage = async (payload: any) => {
    try {
        const res = await axios.post(
            `${backendUrl}/api/v1/payments/dodo-checkout`,
            payload
        );

        if (!res.data?.checkout_url) {
            throw new Error("No checkout URL returned from server.");
        }

        return res.data.checkout_url;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to initiate checkout.");
    }
};

export const checkout = async (productId: string) => {
    try {
        const res = await axios.get(
            `${backendUrl}/api/v1/payments/dodo-checkout?productId=${productId}`
        );

        if (!res.data?.checkout_url) {
            throw new Error("No checkout URL returned from server.");
        }

        return res.data.checkout_url;
    }
    catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to initiate checkout.");
    }
}

// export function useCheckout() {
//     return useMutation({
//         mutationFn: checkout,
//     })
// }