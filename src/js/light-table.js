class LightTable {

   
    constructor(options) {

        //default options
        const defaults = { 
            selector : 'table',  // string
            stickyHead : false, // boolean true | false
            search : false, // boolean true | false
            pagination :false,
            paginationPerPage :10,
            theme : 'black', //string

            labels : {
                searchAnyThing : 'Search any thing'
            }
        };

        //append args to defaults
        this.options = { ...defaults,  ...options };

        //labels
        this.labels = this.options.labels;

        //select all elements
        let elements = document.querySelectorAll(this.options.selector);
        if(elements.length==0){
            return;
        }

console.log('this.options.selector',this.options.selector);
        //draw tables
       
        elements.forEach(element => {
          
            let tableIndex=(Math.floor(Math.random() * 1000) + 1 ) + (Math.floor(Math.random() * 100) + 1 )

            //create wrapper
            let wrapper = document.createElement('div');
            wrapper.setAttribute('data-id','lt-table-'+tableIndex);
            wrapper.setAttribute('data-pagination',this.options.pagination ? 'yes' : 'no');
            wrapper.setAttribute('data-pagination_items',this.options.paginationPerPage);
            wrapper.setAttribute('data-sort',0);
            wrapper.setAttribute('data-sort_type',1);

            // insert a new node after the last list item
            element.parentNode.insertBefore(wrapper,  element);

            //add main css selector
            wrapper.classList.add("lt-table");

            //add theme css selector
            wrapper.classList.add("lt-"+this.options.theme);

            //add header
            let header = document.createElement('div');
            header.classList.add("lt-table-header");
            wrapper.appendChild(header);

            //move the table html to the wrapper
            let thetable = document.createElement('div');
            thetable.classList.add("lt-table-table");
            thetable.innerHTML = element.outerHTML;
            wrapper.appendChild(thetable);
 
            //add footer
            let footer = document.createElement('div');
            footer.classList.add("lt-table-footer");
            wrapper.appendChild(footer);


            //remove the org table 
           
            element.setAttribute('data-id','lt-table-'+tableIndex);
            element.style.display = 'none';
            element.setAttribute('id','lt-table-hidden-'+tableIndex);
 
             
 
            //add sticky head
            if(this.options.stickyHead){
                wrapper.classList.add("lt-sticky");
            }

            //add search
            if(this.options.search){
                //incase of same input id
                let magic=Math.floor(Math.random() * 1000) + 1;
                let theSearch = document.createElement('div');
                theSearch.classList.add("lt-table-search");
                theSearch.innerHTML = '<label for="lt-table-search'+magic+'">'+this.labels.searchAnyThing+':</label><input type="text" id="lt-table-search'+magic+'" name="lt-table-search'+magic+'" />';
                header.appendChild(theSearch);


                //hook change input value
                wrapper.querySelectorAll('.lt-table-search input').forEach(fi => {   
                    fi.addEventListener('input',LightTable.#inputChanged);
                });
               
            }
 
 
            if(this.options.pagination){
                //html pagination
                let thePagination= document.createElement('div');
                thePagination.classList.add("lt-table-pagination");
                thePagination.innerHTML = '';
                footer.appendChild(thePagination);

                //reload table
                LightTable.#reloadData(wrapper,1);
                
            }
     


            //click on th to make sort
            wrapper.querySelectorAll('th[data-sortable="yes"]').forEach(fi => {   

                
                fi.addEventListener('click',function(e){
                    const p=e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
                        let elem = e.target;
                        let elementIndex=      [...elem.parentNode.children].indexOf(elem);
                        p.setAttribute('data-sort',elementIndex); 

                        let targetSort= parseInt(p.dataset.sort_type)===1 ? 2 : 1;
                        p.setAttribute('data-sort_type',targetSort); 


                        //reload table
                        LightTable.#reloadData(p,1);
                });
            });

             
        });
 

    


    }


    static #reloadData(p,page){
        //render pagination
        LightTable.#buildPagination(p);
        //apply search before continue to the page
        LightTable.#doSearch(p);
        //do sort
        LightTable.#doSort(p);
        //go to first page
        LightTable.#goToPage(p,1);
    }



    static #doSort(p){
    

        let elementIndex= parseInt(p.dataset.sort);
        let targetSort= parseInt(p.dataset.sort_type);
 
 
   
        let target = p.querySelectorAll('table')[0];
       

        let data=[];
        const targetTRS = target.querySelectorAll('tbody tr');
        targetTRS.forEach(tr => {   
            const txt = tr.querySelectorAll('td:nth-child('+(elementIndex+1)+')')[0].textContent;
            data.push(txt);

        });
        let isNumber = data.every(function(element) {return /^-?\d+$/.test(element);});
 
        //sort values
        if(isNumber){
            data.sort(function(a, b){return a - b});
        }else{
            data.sort();
        }
         

        if(targetSort===2){
            data.reverse();
        }


        //remove duplicates
        data =new Set(data);


 
        //reorder
        data.forEach( val => {   

            targetTRS.forEach(tr => {   
                let tmpTr = tr.parentElement;
                const txt = tr.querySelectorAll('td:nth-child('+(elementIndex+1)+')')[0].textContent;
                if(txt===val){

                    let newTr = document.createElement('tr');
                    newTr.innerHTML = tr.innerHTML;
                    
                    tr.remove();
                     tmpTr.insertBefore(newTr, tmpTr.firstElementChild);
                 }
    
            });
 

        });
 

 
        
 
    }


    static #inputChanged(e){
        //wrapper root
        const p=e.target.parentElement.parentElement.parentElement;        
        //reload table
        LightTable.#reloadData(p,1);
    }


    static #goToPage(p,page){

        
        //current id
        let id = p.dataset.id;
        const perpage = parseInt(p.dataset.pagination_items);
  
        //target
        let target = document.querySelectorAll('.lt-table[data-id="'+p.dataset.id+'"] table')[0];

        //source
        let source = document.querySelectorAll('table[data-id="'+p.dataset.id+'"]')[0];
        let tartgetTbody =  target.querySelectorAll('tbody')[0];
 
        page = page -1;
        
        let start = page*perpage + 1;
        let end = start+perpage;

     
        //keep first page
        let currentIndex=0;
        const trList =  p.querySelectorAll('table tbody tr');
        trList.forEach(tr => {   
            currentIndex++;
             if(currentIndex<start || currentIndex>=end ){
                tr.remove();
            }
        });


        //change apperance of current button
        const buttons =  p.querySelectorAll('.lt-table-pagination button');
     
        buttons.forEach(b => {   
            b.classList.remove("current");
        });
        p.querySelectorAll('.lt-table-pagination button[data-page="'+(page+1)+'"]')[0].classList.add("current");
    }


    //build pagination
    static #buildPagination(p){
        //current id
        const id = p.dataset.id;
 
        const pagi =  p.querySelectorAll('.lt-table-pagination')[0];
        const target = document.querySelectorAll('.lt-table[data-id="'+p.dataset.id+'"] table')[0];
        const perpage = p.dataset.pagination_items;

     
        //apply current search
        LightTable.#doSearch(p);
 
        //calc rows
        const rows= target.querySelectorAll('tbody tr').length;
        const pages = Math.ceil(rows / perpage);
 
        let html='';
        for(let i=1;i<=pages;i++){
            html+='<button data-page="'+i+'" class="'+(i==1 ? 'current' : '')+' lt-table-toggle-pagination">'+i+'</button>';
        }
      
        //force html
        pagi.innerHTML =html;


        //trigger click buttons
        const buttons = pagi.querySelectorAll('button');
        for(var i=0;i<buttons.length;i++){                 
                buttons[i].addEventListener("click", function(e) {

                            //wrapper root
                        const p=this.parentElement.parentElement.parentElement;
                        //current value
                        const page = this.dataset.page;

                         //apply search before continue to the page
                        LightTable.#doSearch(p);

                        //sort by current order
                        LightTable.#doSort(p); 

                        LightTable.#goToPage(p,page);
                

                }, false);
        }
 
    }


 
    static #doSearch(p){

        //current id
        let id = p.dataset.id;
        //source and target
        let target = document.querySelectorAll('.lt-table[data-id="'+p.dataset.id+'"] table')[0];
        let source = document.querySelectorAll('table[data-id="'+p.dataset.id+'"]')[0];
        let tartgetTbody =  target.querySelectorAll('tbody')[0];

        //if there is search then get val
        let v = '';
        const sf= p.querySelectorAll('.lt-table-search input').length;
        if(sf>0){
            v = p.querySelectorAll('.lt-table-search input')[0].value.toLowerCase();
        }
 
        //if search empty then show all
        if(v.length==0){
            tartgetTbody.innerHTML=source.querySelectorAll('tbody')[0].outerHTML;
            return;
        }

        //clear current table
        let trs =  tartgetTbody;
        trs.innerHTML='';


        //start find matched
        let html='';
        let strs =  source.querySelectorAll('tbody tr');
        strs.forEach(tr => {
            let tdText = '';
            tr.querySelectorAll('td:not(.lt-exclude-search)').forEach(td => {
                tdText+=' '+td.textContent.toLowerCase();
            });

            //find contain substring
            if(tdText.includes(v)){
                html+=tr.outerHTML;
            }
        });

  
        tartgetTbody.innerHTML=html;
    }
 

}