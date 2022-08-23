import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PdfOperationComponent } from "./pdf-operation/pdf-operation.component";

const routes: Routes = [
    {

        path: '',
        component: PdfOperationComponent
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})


export class PdfOpsRoutingModule { }