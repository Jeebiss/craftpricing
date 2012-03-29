var CraftPricing = {
	_json: false,
	load: function( json ){
		this._json = json;
	},
	/**
	 * Returns the complete unit price for the item, including
	 * those that this item depends on.
	 */
	getItem: function( alias, debug ){
		debug = (typeof debug === "undefined" ? false : debug);
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
					var r = this.getItem( recipe.alias, debug );
					if(typeof r == "object" && r != null){
						// Determines the cost of the recipe materials
						var buy_per_unit = (r.buy * parseFloat(recipe.quantity, 10));
						var sell_per_unit = (r.sell * parseFloat(recipe.quantity, 10));
						buy += buy_per_unit;
						sell += sell_per_unit;
						if(debug){
							console.log("subrecipe " + recipe.alias + " buys for " + buy_per_unit + " per unit");
							console.log("subrecipe " + recipe.alias + " sell for " + sell_per_unit + " per unit");
						}
					}
				}
				item['buy'] = (buy / parseFloat(item.quantity, 10));
				item['sell'] = (sell / parseFloat(item.quantity, 10));
				if(debug){
					console.log(item.alias + " buys for " + item['buy'] + " per unit");
					console.log(item.alias + " sell for " + item['sell'] + " per unit");
				}
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
		for(item in this._json){
			if (this._json.hasOwnProperty(item)){
				var rsp_item = this._json[item];
				if(typeof rsp_item === "object" && rsp_item != null){
					if(typeof rsp_item.buy !== "undefined" && rsp_item.recipe.length > 0){
						console.log("Item uses recipe, yet has a 'buy' field: " + item + " " + rsp_item.buy);
						// test(item, function() {
						// 	equal( rsp_item.recipe.length, 0);
						// });
					}
					if(typeof rsp_item.sell !== "undefined" && rsp_item.recipe.length > 0){
						console.log("Item uses recipe, yet has a 'sell' field: " + item + " " + rsp_item.sell);
					}
				}
			}
		}
	}
}