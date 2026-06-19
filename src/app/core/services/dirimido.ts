import { HttpClient } from '@angular/common/http';
import { inject, Inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { DirimidoRequest, DirimidoResponse, ExpedienteResponse, MagistradoResponse } from '../interfaces/dirimido';

@Inject({
    providedIn: 'root'
})
export class DirimidoService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}`;

    getDirimidos(): Observable<DirimidoResponse[]> {
        return this.http.get<DirimidoResponse[]>(`${this.apiUrl}/dirimido`);
    }

    getExpedienteById(id: number): Observable<ExpedienteResponse> {
        return this.http.get<ExpedienteResponse>(`${this.apiUrl}/expediente/${id}`);
    }

    getMagistrados(): Observable<MagistradoResponse[]> {
        return this.http.get<MagistradoResponse[]>(`${this.apiUrl}/magistrado`);
    }

    saveDirimido(data: DirimidoRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/dirimido`, data);
    }

    updateDirimido(id: number, data: DirimidoRequest): Observable<any> {
        return this.http.put(`${this.apiUrl}/dirimido/${id}`, data);
    }

    deleteDirimido(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/dirimido/${id}`);
    }

}
