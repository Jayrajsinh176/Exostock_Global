const requiredEnvVars = [
    "MONGO_URI",
    "JWT_SECRET",
    "PORT",
]

const validateEnv = () => {
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if(missing.length > 0){
        console.error(`Missing required environment variables: ${missing.join(", ")}`);
        process.exit(1);
    }
    if(process.env.JWT_SECRET.length < 32){
        console.error("JWT_SECRET must be at least 32 characters long");
        process.exit(1);
    
    }

    console.log("Environment Variable Validated")

}

export default validateEnv;