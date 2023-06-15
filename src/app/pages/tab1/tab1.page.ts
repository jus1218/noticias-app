import { Component, OnInit, ViewChild } from '@angular/core';
import { NewService } from '../../services/new.service';
import { Article, NewsResponse } from '../../interfaces/index';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  public articles: Article[] = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  constructor(private newService: NewService) {}

  ngOnInit(): void {
    this.newService.getTopHeadLines().subscribe((res: Article[]) => {
      res.map((item: Article) => {
        if (item.urlToImage === null) {
          item.urlToImage =
            'https://ionicframework.com/docs/img/demos/card-media.png';
        }
        return item;
      });

      this.articles.push(...res);
    });
  }

  loadData() {
    this.newService
      .getTopHeadLinesByCategory('business', true)
      .subscribe((articles: Article[]) => {
        //*Tiene un error */
        if (articles.length === this.articles.length) {
          this.infiniteScroll.disabled = true;
          //event.target.disable = true;
          return;
        }

        this.articles = articles;
        setTimeout(() => {
          this.infiniteScroll.complete();
          //event.target.complete();
        }, 1000);
      });
  }
}
