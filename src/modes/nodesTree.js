export default class NodesTree {
    
    constructor() {
        this.tree = this.buildTree();
        this.data = null;
    }
    
    setData(data, tree){

        this.data = data;

        let treeTemp = (tree) ? tree : this.tree;

        this.iterTree(treeTemp, addData);

        treeTemp.value = 0;

        treeTemp.children.forEach(function(child){treeTemp.value += child.value;}.bind(this));

        function addData(tree){
            
            let node = data.find(function(dataNode){ return dataNode.target == tree.target})

            tree.value = (node != undefined) ? node.value : 0;
        }
    }

    iterTree(tree, fn){        
        fn(tree);

        if(tree.children.length > 0){
            tree.children.forEach(branch => this.iterTree(branch, fn));
        }
    }

    toArray(){
        let treeAsArray = [];

        var clone = this.buildTree();

        if(this.data) this.setData(this.data, clone);

        this.iterTree(clone, fillArray);
        
        return treeAsArray;

        function fillArray(tree){

            treeAsArray.push(tree);
        }
        
       /*  function cloneItem(item){
            let itemTemp = {};
            let dummy = JSON.stringify(item);
            debugger
             for(let key in item){
                itemTemp[key] = item[key];
            } 

            return itemTemp;
        } */
    }

    toLines(title, columns){
        let lines = [];

        const titleRow = [title];
        let columsRow = columns;
        let data = this.toArray();
        lines.push(titleRow,[], columsRow);

        data.forEach(function(item){
            lines.push([i18next.t(item.name, {ns: "modes"}), item.value]);
        })

        return lines;
    }
    buildTree(){
        const tree = [
            {
              "node": 0,
              "target" : 0, 
                       
              "level" : 0,
              "value" : null,
              "name": "intl",              
              "children" : [
                {
                    "node": 1,
                    "target" : 1,
                    "level" : 1,                    
                    "value" : null,
                    "name": "USres",
                    "children" : [
                        {
                            "node": 5,
                            "target" : 5,
                            "level" : 2,
                            "value" : null,
                            "name": "USres_air",
                            "children" : []
                        },
                        {
                            "node": 6,
                            "target" : 6,
                            "level" : 2,
                            "value" : null,
                            "name": "USres_marine",
                            "children" : []
                        },
                        {
                            "node": 7,
                            "target" : 7,
                            "level" : 2,
                            "value" : null,
                            "name": "USres_land",
                            "children" : [
                                {
                                    "node": 17,
                                    "target" : 17,
                                    "level" : 3,
                                    "value" : null,
                                    "name": "USres_car",
                                    "children" : []
                                },
                                {
                                    "node": 18,
                                    "target" : 18,
                                    "level" : 3,
                                    "value" : null,
                                    "name": "USres_bus",
                                    "children" : []
                                },
                                {
                                    "node": 19,
                                    "target" : 19,
                                    "level" : 3,
                                    "value" : null,
                                    "name": "USres_train",
                                    "children" : []
                                },
                                {
                                    "node": 20,
                                    "target" : 20,
                                    "level" : 3,
                                    "value" : null,
                                    "name": "USres_other",
                                    "children" : []
                                }
                            ]
                        }

                ]

                },
                {
                    "node": 2,
                    "target" : 2,
                    "level" : 1,
                    "value" : null,
                    "name": "nonUSres",
                    "children" : [
                        {
                            "node": 8,                            
                            "target" : 8,
                            "level" : 2,
                            "value" : null,
                            "name": "nonUSres_air",
                            "children" : []
                        },
                        {
                            "node": 9,
                            "target" : 9,
                            "level" : 2,
                            "value" : null,
                            "name": "nonUSres_marine",
                            "children" : []
                        },
                        {
                            "node": 10,
                            "target" : 10,
                            "level" : 2,
                            "value" : null,
                            "name": "nonUSres_land",
                            "children" : []
                        }
                    ]
                },
                {
                    "node": 3,
                    "target" : 3,
                    "level" : 1,
                    "value" : null,
                    "name": "cdnFromUS",
                    "children" : [
                        {
                            "node": 11,
                            "target" : 11,
                            "level" : 2,
                            "value" : null,
                            "name": "cdnFromUS_air",
                            "children" : []
                        },
                        {
                            "node": 12,
                            "target" : 12,
                            "level" : 2,
                            "value" : null,
                            "name": "cdnFromUS_marine",
                            "children" : []
                        },
                        {
                            "node": 13,
                            "target" : 13,
                            "level" : 2,
                            "value" : null,
                            "name": "cdnFromUS_land",
                            "children" : [
                                {
                                    "node": 21,
                                    "target" : 21,
                                    "level" : 3,
                                    "value" : null,
                                    "name": "cdnFromUS_car",
                                    "children" : []
                                },
                                {
                                    "node": 22,
                                    "target" : 22,
                                    "level" : 3,
                                    "value" : null,
                                    "name": "cdnFromUS_bus",
                                    "children" : []
                                },
                                {
                                    "node": 23,
                                    "target" : 23,
                                    "level" : 3,
                                    "value" : null,
                                    "name": "cdnFromUS_train",
                                    "children" : []
                                },
                                {
                                    "node": 24,
                                    "target" : 24,
                                    "level" : 3,
                                    "value" : null,
                                    "name": "cdnFromUS_other",
                                    "children" : []
                                }
                            ]
                        }
                    ]
                },
                {
                    "node": 4,
                    "target" : 4,
                    "level" : 1,
                    "value" : null,
                    "name": "cdnFromOther",
                    "children" : [
                        {
                            "node": 14,
                            "target" : 14,
                            "level" : 2,
                            "value" : null,
                            "name": "cdnFromOther_air",
                            "children" : []
                        },
                        {
                            "node": 15,
                            "target" : 15,
                            "level" : 2,
                            "value" : null,
                            "name": "cdnFromOther_marine",
                            "children" : []
                        },
                        {
                            "node": 16,
                            "target" : 16,
                            "level" : 2,
                            "value" : null,
                            "name": "cdnFromOther_land",
                            "children" : []
                        }
                    ]
                }                
              ]            
            }]; 

            return tree[0];  // returns root of tree
    }
  
    
  }
  