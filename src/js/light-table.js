class LightTable {
 

    constructor(options) {
 
 
        //default options
        const defaults = { 
            selector : 'table',  // string
            stickyHead : false, // boolean true | false
            search : false, // boolean true | false
            
            //pagination
            pagination :false,
            paginationPerPage :10,

            //theme
            theme : 'black', //string

            //export options
            print :false,
            exportCSV :false,
            exportCSVFileName :'',

            //charts
            charts :[],//charts 

            //strings
            labels : {
                print : 'Print',
                exportCSV : 'Export CSV',
                searchAnyThing : 'Search any thing'
            }
        };

        defaults.exportCSVFileName = 'light table export '+new Date().toDateString();

        //append args to defaults
        this.options = { ...defaults,  ...options };

        //labels
        this.labels = this.options.labels;

        //select all elements
        let elements = document.querySelectorAll(this.options.selector);
        if(elements.length==0){
            return;
        }

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
 
            //add charts
            let charts = document.createElement('div');
            charts.classList.add("lt-table-charts");
            wrapper.appendChild(charts);


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


            
            //add actions container to header
            let headerActions = document.createElement('div');
            headerActions.classList.add("lt-table-actions");
            header.appendChild(headerActions);

            //print
            if(this.options.print){
                LightTable.#print(headerActions,this.labels);
            }
            //csv
            if(this.options.exportCSV){
                LightTable.#exportCSV(headerActions,this.labels,this.options);
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



            if(options.charts.length>0){
               
                options.charts.forEach((chart) => {  
                    LightTable.#loadChart(wrapper,chart); 
                });
              
            }
     

             
        });




   

    


    }

    //print the table action
    static #exportCSV(headerActions,labels,options){
      
        let headerExportCSV = document.createElement('button');
        headerExportCSV.classList.add("lt-table-actions-exportcsv");
        headerExportCSV.innerHTML='<span>'+labels.exportCSV+'</span>';
        headerActions.appendChild(headerExportCSV);


     
        


        //trigger click
        headerExportCSV.addEventListener('click',function(e){
            const p=e.target.parentElement.parentElement.parentElement.parentElement;
                let elem = e.target;
                let target = p.querySelectorAll('table')[0];
                let page = p.querySelectorAll('.lt-table-toggle-pagination.current')[0].dataset.page;
 

                //apply search to show all related data
                LightTable.#doSearch(p);

                // Variable to store the final csv data
                var csv_data = [];
                
                // Get each row data
                var rows = target.querySelectorAll('tr');
                for (var i = 0; i < rows.length; i++) {

                    // Get each column data
                    var cols = rows[i].querySelectorAll('td,th');

                    // Stores each csv row data
                    var csvrow = [];
                    for (var j = 0; j < cols.length; j++) {

                        // Get the text data of each cell of
                        // a row and push it to csvrow
                        csvrow.push(cols[j].innerHTML);
                    }

                    // Combine each column value with comma
                    csv_data.push(csvrow.join(","));
                }
                // combine each row data with new line character
                csv_data = csv_data.join('\n');

                // Create CSV file object and feed our
                    // csv_data into it
                    let CSVFile = new Blob([csv_data], { type: "text/csv" });
                
                    // Create to temporary link to initiate
                    // download process
                    var temp_link = document.createElement('a');
                
                    // Download csv file
                    temp_link.download = options.exportCSVFileName+".csv";
                    var url = window.URL.createObjectURL(CSVFile);
                    temp_link.href = url;
                
                    // This link should not be displayed
                    temp_link.style.display = "none";
                    document.body.appendChild(temp_link);
                
                    // Automatically click the link to trigger download
                    temp_link.click();
                    document.body.removeChild(temp_link);





                    //do sort
                    LightTable.#doSort(p);
                    //go to first page
                   LightTable.#goToPage(p,page);

        });



    }


    //print the table action
    static #print(headerActions,labels){
      
        let headerPrint = document.createElement('button');
        headerPrint.classList.add("lt-table-actions-print");
        headerPrint.innerHTML='<span>'+labels.print+'</span>';
        headerActions.appendChild(headerPrint);

        //trigger click
        headerPrint.addEventListener('click',function(e){
            const p=e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
                let elem = e.target;
                let target = p.querySelectorAll('table')[0];

                let printArea = window.open('', 'PRINT', 'height=1000,width=1200');

                printArea.document.write('<html><head><title>' + document.title  + '</title>');
                printArea.document.write('</head><body >');


                let cssContent='<style>';
                cssContent+='table{ border-collapse: collapse; }';
                cssContent+='table th,table td {padding:5px; border: 1px solid #000;} ';
                cssContent+='table tbody *{ color: #000; } ';
                cssContent+='</style>';

                printArea.document.write(cssContent);
        
            
                printArea.document.write('<h1>' + document.title  + '</h1>');
                printArea.document.write(target.outerHTML);
                printArea.document.write('</body></html>');

                printArea.document.close(); // necessary for IE >= 10
                printArea.focus(); // necessary for IE >= 10*/

                printArea.print();
            //    printArea.close();

                return true;
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
 


    static #loadChart(p,chart){

        let magic=Math.floor(Math.random() * 1000) + 1;
        const svgId = 'lt-table-charts-'+magic;
        const chartWrapper = p.querySelectorAll('.lt-table-charts')[0];

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('id', svgId);
        chartWrapper.appendChild(svg);


        const args = [p,chart,svgId];
//index



        //load bars
        LightTable.#loadChartBars(args); 

 

      window.addEventListener('resize',function(){
        LightTable.#loadChartBars(args);
      });

    }
    static #loadChartBars(args){

        let p = args[0];
        let chart = args[1];
        let svgId = args[2];
 
 
        const svg = document.getElementById(svgId);
       // const trs =  p.querySelectorAll('tbody tr');

        //source
        let source = document.querySelectorAll('table[data-id="'+p.dataset.id+'"]')[0];
        let trs =  source.querySelectorAll('tbody tr');
    
         

        svg.innerHTML='';

        let data = [];
        trs.forEach((tr,index) => {
         
            console.log(tr.querySelectorAll('td')[chart.x]);
            if(typeof tr.querySelectorAll('td')[chart.x]!='undefined'
            && typeof tr.querySelectorAll('td')[chart.y]!='undefined'){
                const xVal = tr.querySelectorAll('td')[chart.x].textContent;
                const   yVal = tr.querySelectorAll('td')[chart.y].textContent;
                const ob = {
                    label : xVal,
                    value : yVal
                };
                data.push(ob);  
            }
        });
        if(data.length==0){
            console.warn('data not found in table!');
            return;
        }
 


   
        //svg.clientWidth

        let dataValues = data.map(function (item) {
            return item.value;
        });


        const maxValue = Math.max(...dataValues);
    
        // Calculate the coordinates and dimensions
        let width =  !chart.hideAxis ? svg.clientWidth - 60 : svg.clientWidth;
        let height =  !chart.hideAxis ? svg.clientHeight - 60 : svg.clientHeight;

        let xScale = (width - chart.spacing * (data.length - 1)) / data.length;
        let yScale = height / maxValue;
 
        //horizintal lines 
        if(chart.horizintalLines){
            // Add labels to y-axis
            for (let i = 1; i <= maxValue; i += Math.round(maxValue / chart.axisScaleUnit)) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('transform', 'translate(30 30)');
                line.setAttribute('x1', 0);
                line.setAttribute('y1',height - i * yScale);
                line.setAttribute('x2', width);
                line.setAttribute('y2', height - i * yScale);
                line.setAttribute('stroke', chart.horizintalLinesColors);
                line.setAttribute('stroke-width', '1');
                svg.appendChild(line);
            }
        }



        //visualization group
        const vGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        vGroup.classList.add("lt-chart-visual");
        if(!chart.hideAxis){
            vGroup.setAttribute('transform', 'translate(30 30)');
        }else{
            vGroup.setAttribute('transform', 'translate(0 0)');
        }
         
        vGroup.setAttribute('width', width);
        vGroup.setAttribute('height', height);
    
        svg.appendChild(vGroup);



        
        // Draw the bars and labels
        for (let i = 0; i < data.length; i++) {

            // Create a group for slices and labels
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.classList.add("lt-chart-item");
            vGroup.appendChild(group);


            
            const value = data[i].value;
            const barHeight = value * yScale;
         
            const barWidth = xScale;
            const x = i * (barWidth + chart.spacing);
            const y = height - barHeight;

 
            // Draw the bar
            const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bar.setAttribute('x', x);
            bar.setAttribute('y', y);
            bar.setAttribute('width', barWidth);
            bar.setAttribute('height', barHeight);
            bar.setAttribute('fill', chart.color);
 

            group.appendChild(bar);


              // hoverText
              if(chart.hover){
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.classList.add("lt-chart-hover");
                label.setAttribute('x', x + barWidth / 2);
                label.setAttribute('y', y + barHeight / 2);
                 
                  label.setAttribute('fill', chart.hoverColor);
              
                label.setAttribute('text-anchor', 'middle');
                label.textContent =value.toString();
                group.appendChild(label);
              }
      
       
            // Add label
            if(!chart.hideLabel){
              const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
              label.setAttribute('x', x + barWidth / 2);
              label.setAttribute('y', y - 5);
              label.setAttribute('text-anchor', 'middle');
              label.textContent = value.toString();
              group.appendChild(label);
            }
        }



        
        if(!chart.hideAxis){
   
  
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.classList.add("lt-chart-axis");
            group.setAttribute('transform', 'translate(30 30)');
            svg.appendChild(group);
  
            const barWidth = xScale;
  
              // Draw the x-axis
              const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
              xAxis.setAttribute('x1', 0);
              xAxis.setAttribute('y1', height);
              xAxis.setAttribute('x2', width);
              xAxis.setAttribute('y2', height);
              xAxis.setAttribute('stroke', '#787878');
              xAxis.setAttribute('stroke-width', '1');
              group.appendChild(xAxis);
          
              // Draw the y-axis
              const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
              yAxis.setAttribute('x1', 0);
              yAxis.setAttribute('y1', 0);
              yAxis.setAttribute('x2', 0);
              yAxis.setAttribute('y2', height);
              yAxis.setAttribute('stroke', '#787878');
              yAxis.setAttribute('stroke-width', '1');
              group.appendChild(yAxis);
          
              // Add labels to x-axis
  
              for (let i = 0; i < data.length; i++) {
  
  
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', i * (barWidth + chart.spacing) + barWidth / 2);
                label.setAttribute('y', height + 15);
                label.setAttribute('text-anchor', 'middle');
                label.textContent = data[i].label;
                label.setAttribute('fill', '#787878');
                group.appendChild(label);
              }
          
              // Add labels to y-axis
              for (let i = 0; i <= maxValue; i += Math.round(maxValue / chart.axisScaleUnit)) {
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', -5);
                label.setAttribute('y', height - i * yScale);
                label.setAttribute('text-anchor', 'end');
                label.setAttribute('alignment-baseline', 'middle');
                label.textContent = i.toString();
                label.setAttribute('fill', '#787878');
                group.appendChild(label);
              }
          }
        
 

     


//lt-table-charts
    }

}