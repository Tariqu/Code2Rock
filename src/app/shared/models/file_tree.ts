export interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
}

export interface FoodNode {
    name: string;
    children?: FoodNode[];
}
