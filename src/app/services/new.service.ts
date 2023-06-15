import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  NewsResponse,
  Article,
  ArticlesByCategoryAndPage,
} from '../interfaces/index';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class NewService {
  private articleByCategoryAndPage: ArticlesByCategoryAndPage = {};

  constructor(private http: HttpClient) {}

  private executeQuery<NewsResponse>(endPoint: string) {
    console.log('Peticion HTTP realizada');

    return this.http.get<NewsResponse>(`${apiUrl}${endPoint}`, {
      params: { apiKey, country: 'us' },
    });
  }

  getTopHeadLines(): Observable<Article[]> {
    return this.getArticlesByCategory('business');
  }

  getTopHeadLinesByCategory(
    category: string,
    loadMore: boolean = false
  ): Observable<Article[]> {
    //* Cargar nueva page?
    if (loadMore) {
      return this.getArticlesByCategory(category);
    }

    //* No existe la category?
    if (this.articleByCategoryAndPage[category]) {
      return of(this.articleByCategoryAndPage[category].articles);
    }

    //*Traer los articulos
    return this.getArticlesByCategory(category);
  }

  private getArticlesByCategory(category: string): Observable<Article[]> {
    if (Object.keys(this.articleByCategoryAndPage).includes(category)) {
      //*existe
      //this.articleByCategoryAndPage[category].page += 1;
    } else {
      this.articleByCategoryAndPage[category] = {
        page: 0,
        articles: [],
      };
    }

    const page = this.articleByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(
      `/top-headlines?category=${category}&page=${page}`
    ).pipe(
      map(({ articles }) => {
        if (articles.length === 0) return [];

        this.articleByCategoryAndPage[category] = {
          page: page,
          articles: [
            ...this.articleByCategoryAndPage[category].articles,
            ...articles,
          ],
        };

        return this.articleByCategoryAndPage[category].articles;
      })
    );
  }
}
