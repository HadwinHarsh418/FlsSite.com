import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidemenuComponent
  ],
  exports: [
    LayoutComponent,
    HeaderComponent
  ],
  imports: [
    RouterModule,
    CommonModule
  ],
})
export class LayoutModule { }
