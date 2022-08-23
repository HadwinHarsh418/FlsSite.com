import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClpsListingComponent } from "./clps-listing/clps-listing.component";
import { InfoClpsComponent } from "./info-clps/info-clps.component";
import { ReviewClpItemComponent } from "./review-clp-item/review-clp-item.component";

const routes: Routes = [
    {
        path: '',
        component: ClpsListingComponent
    },
    {
        path: 'review-clp-items',
        component: ReviewClpItemComponent
    },
    {
        path: 'clp-info',
        component: InfoClpsComponent
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CplsRoutingModule { }