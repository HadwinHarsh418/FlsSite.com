import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CategoryComponent } from "./category/category.component";
import { DailyClpItemsComponent } from "./daily-clp-items/daily-clp-items.component";
import { FtyNotesComponent } from "./fty-notes/fty-notes.component";
import { FtyComponent } from "./fty/fty.component";
import { InventoryQueueComponent } from "./inventory-queue/inventory-queue.component";
import { ItemsListingComponent } from "./items-listing/items-listing.component";
import { PdInquiryComponent } from "./pd-inquiry/pd-inquiry.component";
import { PivotComponent } from "./pivot/pivot.component";
import { PriceInquiryComponent } from "./price-inquiry/price-inquiry.component";
import { SalesDetailsComponent } from "./sales-details/sales-details.component";
import { AgGirdComponent } from "./ag-gird/ag-gird.component";
import { DemoGridComponent } from './demo-grid/demo-grid.component';
import { DemoApiComponent } from "./demo-api/demo-api.component";
import { OrderComponent } from "./order/order.component";
import { ChargeBackComponent } from "./charge-back/charge-back.component";
import { ShipIdTrackerComponent } from "./ship-id-tracker/ship-id-tracker.component";
import { ShipTrackerComponent } from "src/app/pages/items/ship-tracker/ship-tracker.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { ShipIdTrackerNewComponent } from "./ship-id-tracker-new/ship-id-tracker-new.component";


const routes: Routes = [
    {
        path: '',
        component: ItemsListingComponent
    },
    {
        path: 'fty',
        component: FtyComponent
    },
    {
        path: 'category',
        component: CategoryComponent
    },
    {
        path: 'pivot-report',
        component: PivotComponent
    },
    {
        path: 'sales-details',
        component: SalesDetailsComponent
    },
    {
        path: 'sales-order',
        component: OrderComponent
    },
    {
        path: 'chargeback-claims',
        component: ChargeBackComponent
    },

    {
        path: 'agGrid',
        component: AgGirdComponent
    },
    {
        path: 'demo-grid',
        component: DemoGridComponent
    },
    {
        path: 'demo-api',
        component: DemoApiComponent
    },

    {
        path: 'price-inquiry',
        component: PriceInquiryComponent
    },
    {
        path: 'pd-inquiry',
        component: PdInquiryComponent
    },
    {
        path: 'inventory-queue',
        component: InventoryQueueComponent
    },
    {
        path: 'daily-clp-items',
        component: DailyClpItemsComponent
    },
    {
        path: 'fty-notes',
        component: FtyNotesComponent
    },
    {
        path: 'ship-id',
        component: ShipIdTrackerComponent
    },
    {
        path: 'ship-id-new',
        component: ShipIdTrackerNewComponent
    },
    {
        path: 'ship-tracker',
        component: ShipTrackerComponent
    },
    {
        path: 'page',
        component: PaginationComponent
    },
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemsRoutingModule { }