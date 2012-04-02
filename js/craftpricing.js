var CraftPricing = {
	// Internal holder for json
	_json: false,
	/**
	 * Loads the json data into the object
	 */
	load: function( json ){
		this._json = json;
	},
	/**
	 * Returns the complete unit price for the item, including
	 * those that this item depends on.
	 */
	getItem: function( alias ){
		var item = this._json[alias];
		var buy = 0;
		var sell = 0;
		// Only if the item was found in the json
		if(typeof item == "object"){
			// If the buy price isn't defined we must determine it
			if(typeof item.buy === "undefined"){
				// For each item in the recipe
				var l = item.recipe.length;
				for(var i=0;i<l;i++){
					var recipe = item.recipe[i];
					var r = this.getItem( recipe.alias );
					if(typeof r == "object" && r != null){
						// Determines the cost of the recipe materials
						var buy_per_unit = (r.buy * parseFloat(recipe.quantity, 10));
						var sell_per_unit = (r.sell * parseFloat(recipe.quantity, 10));
						buy += buy_per_unit;
						sell += sell_per_unit;
					}
				}
				item['buy'] = (buy / parseFloat(item.quantity, 10));
				item['sell'] = (sell / parseFloat(item.quantity, 10));
				// cache the price, so future recursion isn't necessary
				this._json[alias]["buy"] = item['buy'];
				this._json[alias]["sell"] = item['sell'];
			}
			return item;
		}
		return null;
	},
	/**
	 * Outputs the entire json list using the callback
	 * formatter.
	 */
	generate: function( json, callback ){
		this.load(json);
		for(item in this._json){
			if (this._json.hasOwnProperty(item)){
				var rsp_item = this.getItem( item );
				if(typeof rsp_item === "object" && rsp_item != null){
					if(typeof callback === "function"){
						callback( rsp_item );
					}
				}
			}
		}
	},
	/**
	 * Validates the format of the json data, ensuring no buy/sell data existings
	 * for data with recipes.
	 */
	sanity_check: function(){
		test("Sanity Check", function(){
			for(item in CraftPricing._json){
				if (CraftPricing._json.hasOwnProperty(item)){
					var rsp_item = CraftPricing._json[item];
					if(typeof rsp_item === "object" && rsp_item != null){
						if(typeof rsp_item.buy !== "undefined" || typeof rsp_item.sell !== "undefined"){
							equal( rsp_item.recipe.length, 0, "Checking " + item + ". Ensuring buy/sell fields not present if recipes are.");
						}
						if(rsp_item.recipe.length > 0){
							var l = rsp_item.recipe.length;
							for(var i=0;i<l;i++){
								var recipe = rsp_item.recipe[i];
								var r = CraftPricing._json[recipe.alias];
								equal( typeof r, "object", "Recipe alias was not found: " + recipe.alias );
							}
						}
					}
				}
			}
		});
	},

	/**
	 * List all items we think are base materials.
	 */
	allBaseMaterials: function(){
		for(item in this._json){
			if (this._json.hasOwnProperty(item)){

				var rsp_item = CraftPricing._json[item];
				if(rsp_item.recipe.length == 0){
					console.log(mats);
				}
			}
		}
	}
}