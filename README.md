# Light table 


Light table is a JavaScript library that provides a simple and customizable way to show interactive data using tables. Allowing developers to present data in an engaging and meaningful way like search in table, or resort columns. 


## Features

- Search in table.
- Pagination.
- Sort columns.
- Exclude columnd from search
- Print the table
- Export the table to CSV file

## Installation

Load the required stylesheet and JS:

```html
<link rel="stylesheet" href="dist/css/style.css" />
```

```html
<script src="dist/js/light-table.js"></script>
```


### Usage
Create html table using this format

```html
<table id="table3" >
    <thead>
        <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Birth date</th>
            <th>Grade</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1001</td>
            <td>Ernst</td>
            <td>Handel</td>
            <td>09/25/2020</td>
            <td>90</td>
        </tr>
        <tr>
            <td>1002</td>
            <td>John</td>
            <td>Shipperd</td>
            <td>05/25/2020</td>
            <td>60</td>
        </tr>
        <tr>
            <td>1003</td>
            <td>Antonio</td>
            <td>Marty</td>
            <td>09/25/2020</td>
            <td>90</td>
        </tr>
    </tbody>
</table>
```


Call the library
```javascript
   new LightTable({
        selector : '#table3',
        theme : 'black',
    });
```


### Charts Example
```javascript
   new LightTable({
        selector : '#table3',
        theme : 'black',
        charts : [
            {
                id : 'bars', // chart name, see below available charts
                x : 1, //X column index, 0 for the first column
                y : 4, //Y column index, 0 for the first column
                color: '#c90000', //bars color
                horizintalLines: true, //show horizintal lines
                horizintalLinesColors: '#ccc', //horizintal lines color
                hover: true,  //on hover show label
                hoverColor: 'blue', //hover lable color
                hideLabel: false, //hide bar label
                spacing: 10, //gap between bars
                axisScaleUnit: 5, // jump unit
                hideAxis: false,//hide x, y
            }
        ]
    });
```


## Options
| Key  | type | default value | description |
| ------------- | ------------- | ------------- | ------------- |
| selector  | String  | table  | CSS selector e.g. #table,.table,table, div table  |
| search  | Boolean  | false  | Allow show & hide the search |
| stickyHead  | Boolean  | false  | Makes table's header positioned accordiong to the normal flow of the document |
| print  | Boolean  | false  | Allow print table |
| exportCSV  | Boolean  | false  | Allow export table to CSV file |
| exportCSVFileName  | String  | light table export {Day short name} {Month short name} {Day} {Year}  | Controll CSV file name  |
| pagination  | Boolean  | false  | Allow table pagenation |
| paginationPerPage  | Number  | 10  | Controll how many items shown per page |
| theme  | String  | black  | Choosing theme, Available black, blue |
| labels  | Object  | {}  | Strings translations see below Strings translations |
| charts  | Array  | []  | Array of objects |

## Strings translations
| Key  | default text |
| ------------- | ------------- |
| print  | Print  |
| exportCSV  | Export CSV  |
| searchAnyThing  | Search any thing  |


## Available charts

### Bars
id : bars

Json Object: 

```javascript
    {
        id : 'bars', // chart name, see below available charts
        x : 1, //X column index, 0 for the first column
        y : 4, //Y column index, 0 for the first column
        color: '#c90000', //bars color
        horizintalLines: true, //show horizintal lines
        horizintalLinesColors: '#ccc', //horizintal lines color
        hover: true,  //on hover show label
        hoverColor: 'blue', //hover lable color
        hideLabel: false, //hide bar label
        spacing: 10, //gap between bars
        axisScaleUnit: 5, // jump unit
        hideAxis: false,//hide x, y
    }
```



## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md).



## Roadmap

Please make sure to check out our [Roadmap Discussion](https://github.com/khaliljarban/light-table/issues).



## License

The code and the documentation are released under the [GPL V3 License](LICENSE).