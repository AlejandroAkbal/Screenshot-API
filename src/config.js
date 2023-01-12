export default () => ({
	port: parseInt(process.env.PORT, 10) ?? 5000,

	allowedHosts: process.env.ALLOWED_HOSTS.split(', ') ?? ['localhost']
})
