import { getToken, performTokenRefresh } from "@/lib/auth";

export class TokenFetcher {


     static async Fetch(url, options = {}) {
        options.headers = options.headers || {} ;

        let token = await getToken();
        if (token) {
                options.headers.Authorization = `Bearer ${token}`;

            }
        let response = await fetch( url , options);


        if (token && response.status === 401){
               console.log('attempt token refresh')
               token =  await performTokenRefresh()
               if (token) {
                options.headers.Authorization = `Bearer ${token}`;
            }
            response = await fetch(url,options)
        }
                
        return response
        
        }
}