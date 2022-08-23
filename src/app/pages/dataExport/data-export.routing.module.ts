import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DataComponent } from "./data/data.component";

const routes: Routes = [
    {
        path: '',
        component: DataComponent
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DataExportRoutingModule { }