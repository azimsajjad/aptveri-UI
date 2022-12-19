import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Banner, control } from '../api/libraries';
import { risk } from '../api/libraries';
import { environment } from 'src/environments/environment';

@Injectable()
export class BannerService {

  // private REST_API_SERVER = "http://192.168.1.9:5100/api/libraries";
 // private REST_API_SERVER = "https://localhost:7204/api/libraries";
 private REST_API_SERVER = environment.api_prefix;
  constructor(private httpClient: HttpClient) { }

  public sendGetRequest(): Observable<any>{
    return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadbanners`);
  }


  public sendPostRequest(data: Banner): Observable<any> {
    return this.httpClient.post<Banner>(`${this.REST_API_SERVER}libraries/addbanners`, data);
}


public sendPostcontrolRequest(data: control): Observable<any> {
  return this.httpClient.post<control>(`${this.REST_API_SERVER}libraries/addControls`, data);
}

  public  sendPutRequest(data: Banner): Observable<any> {

    return this.httpClient.put<Banner>(`${this.REST_API_SERVER}libraries/putbanner`, data);
  }

  public  sendPutcontrolRequest(data: control): Observable<any> {

    return this.httpClient.put<control>(`${this.REST_API_SERVER}libraries/putControls`, data);
  }

  public sendDeleteRequest(id: string): Observable<any> {
    return this.httpClient.delete(`${this.REST_API_SERVER}libraries/deletebanner/${id}`)
}

public sendDeleteriskRequest(id: string): Observable<any> {
  return this.httpClient.delete(`${this.REST_API_SERVER}libraries/deleteRisks/${id}`)
}

public sendDeletecontrolRequest(id: string): Observable<any> {
  return this.httpClient.delete(`${this.REST_API_SERVER}libraries/deleteControls/${id}`)
}

public sendGetriskRequest(): Observable<any>{
  return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadRisks`);
}

public sendGetcontrolRequest(): Observable<any>{
  return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadControls`);
}

public sendGetloadRiskExposuretypeRequest(): Observable<any>{
  return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadRiskExposuretype`);
}

public sendGetauditunivthirdRequest(): Observable<any>{
  return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadAuditunivthird`);
}

public sendGetloadKeyControlRequest(): Observable<any>{
  return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadKeyControltype`);
}

public sendGetloadKeyassertionRequest(): Observable<any>{
  return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadAssertiontype`);
}

public sendGetloadKeyCategoryRequest(): Observable<any>{
  return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadCategorytype`);
}

public sendGetloadKeyTypeRequest(): Observable<any>{
  return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadTypetype`);
}

public sendGetloadKeyFrequencyRequest(): Observable<any>{
  return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadFrequencytype`);
}

public sendGetloadKeyControltypeRequest(): Observable<any>{
  return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadControltype`);
}

public sendGetloadAuditunivfourRequest(): Observable<any>{
  return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadAuditunivfour`);
}

public sendGetloadRisktaxoneRequest(): Observable<any>{
  return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadrisktax`);
}

public sendGetloadRisktaxtwoRequest(id: string): Observable<any>{
  return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadrisktaxid/${id}`);
}


    // public sendDeleteRequest(bannerid: string): Observable<any> {
    //   return this.httpClient.delete<string>(this.REST_API_SERVER, bannerid);
    // }

    public sendPostRiskRequest(data: risk): Observable<any> {
      return this.httpClient.post<risk>(`${this.REST_API_SERVER}libraries/addRisks`, data);
  }


    public  sendPutRiskRequest(data: risk): Observable<any> {

      return this.httpClient.put<risk>(`${this.REST_API_SERVER}libraries/putRisks`, data);
    }

    public sendGetloadimpactRequest(): Observable<any>{
  return this.httpClient.get(`${this.REST_API_SERVER}libraries/loadimpact`);
  }


  public sendGetRequestForAuditUniverseall(): Observable<any>{
    //alert("get api");
     return this.httpClient.get(`${this.REST_API_SERVER}AuditUniverse/GetAuditUniverseLevelAll`);
   }


   public sendPostRequestForAuditUniverseall(auditvaluedata: { offsetPageNumber: number; rowCount: number; filters: [{ name: "string"; value: "string"; operation: "string"; orderBy: "string"; }]; }): Observable<any> {
   //  return this.httpClient.post<auditDetails>(`${this.REST_API_SERVER}/AuditUniverseall`, data);

   //console.log(JSON.stringify(auditvaluedata));

    let auditPlanRequest = JSON.stringify(auditvaluedata);


     return this.httpClient.post<any>(`${this.REST_API_SERVER}AuditUniverse/AuditUniverseall`, auditPlanRequest,
       {
         headers: new HttpHeaders({
           'content-type': 'application/json; charset=utf-8'
         })

       }

     );
 }


}
