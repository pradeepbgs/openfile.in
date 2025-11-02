export default {
	async fetch(request, env, ctx): Promise<Response> {

		try {
			const data = await request.json()
			console.log(data);
			
			
		} catch (error) {

		}

		return new Response('Hello World!');
	}
} satisfies ExportedHandler<Env>;
