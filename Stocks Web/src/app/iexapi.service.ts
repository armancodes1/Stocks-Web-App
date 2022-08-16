import { Injectable } from '@angular/core';
import { HttpClient,HttpClientModule,HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class IexapiService {

  constructor(private http: HttpClient) { }

  //apikey = "pk_2c4da05799084b9b9a17c452a0df2b34";
	private apikey = "pk_31d1d392c42343df9655e6067e47387d";
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  getdata(symbol){
    return this.http.get("https://cloud.iexapis.com/stable/stock/" + symbol + "/intraday-prices?token=" + this.apikey + "&chartIEXOnly=True")
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getsymbol(){
    return this.http.get('https://cloud.iexapis.com/beta/ref-data/symbols?token=' + this.apikey)
  } 

  get_data_time(time, symbol){
    return this.http.get("https://cloud.iexapis.com/stable/stock/" + symbol + "/chart/" + time + "?token=" + this.apikey)
  }
  
  get_real(symbol){
    return this.http.get('https://cloud.iexapis.com/stable/stock/' + symbol + '/stats?token=' + this.apikey)
  }

  get_logo_url(symbol){
    return this.http.get('https://cloud.iexapis.com/stable/stock/' + symbol + '/logo?token=' + this.apikey)
  }

  get_ohlc(symbol) {
    return this.http.get('https://cloud.iexapis.com/stable/stock/' + symbol + '/previous?token=' + this.apikey);
  }

  get_multi_prev(symbols){
    return this.http.get('https://cloud.iexapis.com/stable/stock/market/previous?symbols=' + symbols + '&token=' + this.apikey);
  }

  get_multi_stats(symbols){
    return this.http.get('https://cloud.iexapis.com/stable/stock/market/stats?symbols=' + symbols + '&token=' + this.apikey);
  }
	
	get_multi_chart(symbols, range){
		return this.http.get('https://cloud.iexapis.com/stable/stock/market/chart?symbols=' + symbols + '&token=' + this.apikey + '&range=' + range);
	}
}
