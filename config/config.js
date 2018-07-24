exports.config = {
	mongoURI: "mongodb://localhost:27017/db",
	mlabMongoURI: "mongodb://amir:amir123@ds147181.mlab.com:47181/battle_db",
	apiSecretKey: "thisisthesecretkeyforbattle",
	publicURL: ['/register', '/login']
}