# Light table 


Light table is a JavaScript library that provides a simple and customizable way to show interactive data using tables. Allowing developers to present data in an engaging and meaningful way like search in table, or resort columns. 


## Features

- Search in table.
- Pagination.
- Sort columns.
- Exclude columnd from search

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
            <th data-sortable="yes">ID</th>
            <th data-sortable="yes">First Name</th>
            <th>Last Name</th>
            <th>Birth date</th>
            <th data-sortable="yes">Grade</th>
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
        search : true,
        pagination : true,
        stickyHead : true,
        theme : 'black',
    });
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md).



## Roadmap

Please make sure to check out our [Roadmap Discussion](https://github.com/khaliljarban/ozarqa/issues).



## License

The code and the documentation are released under the [GPL V2 License](LICENSE).