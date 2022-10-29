import { NgModule, LOCALE_ID } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import locale from "@angular/common/locales/pt";
import { BrowserModule, Title } from "@angular/platform-browser";

import { DragDropModule } from "@angular/cdk/drag-drop";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { pt_BR } from 'ng-zorro-antd/i18n';
import en from "@angular/common/locales/en";

import { ServiceWorkerModule } from "@angular/service-worker";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { NgxWebstorageModule } from "ngx-webstorage";
import dayjs from "dayjs/esm";
import {
    NgbDateAdapter,
    NgbDatepickerConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { NzButtonModule } from "ng-zorro-antd/button";

import { ApplicationConfigService } from "app/core/config/application-config.service";
import "./config/dayjs";
import { SharedModule } from "app/shared/shared.module";
import { TranslationModule } from "app/shared/language/translation.module";
import { AppRoutingModule } from "./app-routing.module";
import { HomeModule } from "./home/home.module";
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { NgbDateDayjsAdapter } from "./config/datepicker-adapter";
import { fontAwesomeIcons } from "./config/font-awesome-icons";
import { httpInterceptorProviders } from "app/core/interceptor/index";
import { MainComponent } from "./layouts/main/main.component";
import { NavbarComponent } from "./layouts/navbar/navbar.component";
import { FooterComponent } from "./layouts/footer/footer.component";
import { PageRibbonComponent } from "./layouts/profiles/page-ribbon.component";
import { ActiveMenuDirective } from "./layouts/navbar/active-menu.directive";
import { ErrorComponent } from "./layouts/error/error.component";

@NgModule({
    imports: [
        BrowserModule,
        SharedModule,
        HomeModule,
        // jhipster-needle-angular-add-module JHipster will add new module here
        AppRoutingModule,
        // Set this to true to enable service worker (PWA)
        ServiceWorkerModule.register("ngsw-worker.js", { enabled: false }),
        HttpClientModule,
        BrowserAnimationsModule,
        ScrollingModule,
        DragDropModule,
        NgxWebstorageModule.forRoot({
            prefix: "jhi",
            separator: "-",
            caseSensitive: true,
        }),
        TranslationModule,
        NzButtonModule,
    ],
    providers: [
        Title,
        { provide: LOCALE_ID, useValue: pt_BR },
        { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
        httpInterceptorProviders,
    ],
    declarations: [
        MainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        ActiveMenuDirective,
        FooterComponent,
    ],
    bootstrap: [MainComponent],
})
export class AppModule {
    constructor(
        applicationConfigService: ApplicationConfigService,
        iconLibrary: FaIconLibrary,
        dpConfig: NgbDatepickerConfig
    ) {
        applicationConfigService.setEndpointPrefix(SERVER_API_URL);
        registerLocaleData(locale);
        iconLibrary.addIcons(...fontAwesomeIcons);
        dpConfig.minDate = {
            year: dayjs().subtract(100, "year").year(),
            month: 1,
            day: 1,
        };
    }
}
