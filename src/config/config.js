const configs = {
  BASE_URL: "https://backend.anudesh.ai4bharat.org",
  BASE_URL_AUTO: process.env.NEXT_PUBLIC_BACKEND_URL
    ? process.env.NEXT_PUBLIC_BACKEND_URL
       :"http://127.0.0.1:8000",
};

export default configs;
//http://20.51.211.111:8000
//https://backend.anudesh.ai4bharat.org/
// https://backend.dev2.anudesh.ai4bharat.org
//https://backend.prod2.anudesh.ai4bharat.org
// http://127.0.0.1:8000
