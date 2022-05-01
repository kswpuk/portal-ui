const awsConfig = {
  aws_project_region: "eu-west-2",

  aws_cognito_region: "eu-west-2",
  aws_user_pools_id: process.env.REACT_APP_STAGE === "prod" ? "eu-west-2_EFSqjsBX4" : "eu-west-2_bQwDMQ25o",
  aws_user_pools_web_client_id: process.env.REACT_APP_STAGE === "prod" ? "39sq4h3isa2k29cdeea890c6tm" : "40gaadm3icdmh7ois4moo7boqq"
};


export default awsConfig;
