import { Component, Input } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import {
  ActionSheetButton,
  ActionSheetController,
  Platform,
} from '@ionic/angular';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { Article } from '../../interfaces/index';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  @Input() article: Article = {
    source: { name: 'Source Name' },
    author: '',
    title: '',
    description: '',
    url: '',
    urlToImage: '',
    publishedAt: '',
    content: '',
  };

  @Input() index: number = 0;

  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing
  ) {}

  ngOnInit() {}

  openArticle() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create(this.article.url);
      browser.show();
      return;
    }

    window.open(this.article.url, '_blank');
  }

  async onOpenMenu() {
    const normalBtns: ActionSheetButton[] = [
      {
        text: 'Favoritos',
        icon: 'heart-outline',
        handler: () => this.onToggleFavorite(),
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel',
      },
    ];

    const share: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle(),
    };

    if (this.platform.is('capacitor')) {
      normalBtns.unshift(share);
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: normalBtns,
    });
    await actionSheet.present();
  }

  onShareArticle() {
    this.socialSharing.share(
      this.article.title,
      this.article.source.name,
      undefined,
      this.article.url
    );
  }
  onToggleFavorite() {
    console.log('Agregando a favoritos');
  }
}
