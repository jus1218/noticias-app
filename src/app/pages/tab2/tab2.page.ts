import { Component, OnInit, ViewChild } from '@angular/core';
import { NewService } from '../../services/new.service';
import { Article } from '../../interfaces/index';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  public categories: string[] = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology',
  ];

  public articles: Article[] = [];

  public selectedCategory: string = this.categories[0];
  constructor(private newService: NewService) {}

  segmentChanged(category: any) {
    this.selectedCategory = category.target.value;
    //console.log(category.target.value);

    this.newService
      .getTopHeadLinesByCategory(this.selectedCategory)
      .subscribe((articles: Article[]) => {
        //console.log(articles);
        //this.articles = [...this.articles, ...articles];
        this.articles = [...articles];
      });
  }

  ngOnInit() {
    this.newService
      .getTopHeadLinesByCategory(this.selectedCategory)
      .subscribe((articles: Article[]) => {
        //console.log(articles);
        //this.articles = [...this.articles, ...articles];
        this.articles = [...articles];
      });
  }

  loadData() {
    this.newService
      .getTopHeadLinesByCategory(this.selectedCategory, true)
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
