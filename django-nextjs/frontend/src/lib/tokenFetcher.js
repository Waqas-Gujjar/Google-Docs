import { getToken } from "@/lib/auth";

export class TokenFetcher {


     static async Fetch(url, options = {}) {
        options.headers = options.headers || {} ;

        let token = await getToken();
        if (token) {
                options.headers.Authorization = `Bearer ${token}`;

            }
        const response = await fetch( url , options);


        if (token && response.status === 401){
                console.log('attempt token refresh')
            }
                
        return response
        
        }
}