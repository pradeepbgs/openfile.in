import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import React from 'react';
import { MdDelete } from "react-icons/md";

function AlertMenu({
    onConfirm,
    title = "Delete Link",
    description = "Are you sure? This link and all associated access will be permanently removed.",
    trigger,
    open,
    onOpenChange,
}: {
    onConfirm: () => void
    title?: string
    description?: string
    trigger?: React.ReactNode | null
    open?: boolean
    onOpenChange?: (open: boolean) => void
}) {
    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            {trigger !== null && (
                <AlertDialog.Trigger>
                    {trigger ?? (
                        <Button variant="soft" color="red" size="1">
                            <MdDelete color='red' size={20} />
                        </Button>
                    )}
                </AlertDialog.Trigger>
            )}
            <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title>{title}</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    {description}
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">Cancel</Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button variant="solid" color="red" onClick={onConfirm}>Delete</Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
}

export default React.memo(AlertMenu);
