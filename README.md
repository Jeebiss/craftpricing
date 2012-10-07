# CraftPricing

*By viveleroi of http://dhmc.us (server: s.dhmc.us)*

A javascript-based pricing engine for all items in Minecraft.

By entering costs for all base materials, this program will automatically generate prices for all other items - based on their crafting recipe.

To keep this application lightweight and easily distributable, the data is stored in raw JSON format, in the /js/recipe data.

The initial package comes with a set of unit tests for both data structure and price calculations. Adjust the tests expected values and run to ensure your data is complete.

### How to Use

You gotta know some Javascript.

Open generate.html and modify the generate and formatter functions. Need the data as a CSV? Or XML? Or as an sql query for your shop plugin? Write your own formatter and it will be used.

An example formatter is provided, exporting the data into MySQL INSERT queries.


### Todo

- Enable and verify the item ids/prices of new 1.4 items
- Change button recipe
- Add new brewing recipes
