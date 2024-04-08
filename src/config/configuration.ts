export default () => ({
	port: parseInt(process.env.PORT ?? '5000', 10),

	allowedHosts: process.env.ALLOWED_HOSTS?.split(', ') ?? ['localhost']
})
