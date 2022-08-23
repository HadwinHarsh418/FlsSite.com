import { ImagesArr } from "./images";

export class Items {
    id?: string;
    itemNo?: string = '';
    description?: string = '';
    cost?: number ;
    weight?: string = '';
    packing?: string = '';
    collection?: string = '';
    color?: string = '';
    material?: string = '';
    l?: number = 0;
    w?: number = 0;
    h?: number = 0;
    cube?: number = 0;
    lb?: number = 0;
    ti: number = 0;
    hi: number = 0;
    totalCount: number = 0;
    pltQty: number;
    eaUpc?: string = '';
    csUpc?: string = '';
    fdaDesc?: string = '';
    htsCode?: string = '';
    gw?: string = '';
    category?: string = '';
    matchingLid?: string = '';
    fkFtyId?: string = '';
    ftyCode?: string='';
    fkCategoryId?: string = '';
    photoUrl: string = '';
    imagesData: ImagesArr[]

}