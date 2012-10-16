<?php

/**
 * Description of Craftpricing
 *
 * @author botskonet
 */
class Craftpricing {


	protected $_json = false;


	/**
	 *
	 */
	public function __construct() {
		$_jsonfile = file_get_contents( dirname(__FILE__) . '/js/recipes.js' );
		$this->_json = json_decode($_jsonfile, true);
	}


	/**
	 *
	 */
	public function generate(){
		$allitems = array();
		foreach($this->_json as $alias => $item){
			$rsp_item = $this->getItem( $alias );
			if($rsp_item){
				$allitems[] = $rsp_item;
			}
		}
		return $allitems;
	}


	/**
	 *
	 */
	protected function getItem( $alias ){
		$item = $this->_json[$alias];
		if($item){
			if(!isset($item['buy'])){
				$buy = $sell = 0;
				if(!empty($item['recipe'])){
					foreach($item['recipe'] as $recipe){
//						printf('Starting buy (%s), sell (%s) for %s<br>', $buy, $sell, $recipe['alias'] );
						$r = $this->getItem( $recipe['alias'] );
						// Determines the cost of the recipe materials
						if($r){
							$buy_per_unit = ($r['buy'] * $recipe['quantity']);
							$sell_per_unit = ($r['sell'] * $recipe['quantity']);
							$buy += $buy_per_unit;
							$sell += $sell_per_unit;
						}
//						printf('Setting buy (%s), sell (%s) for %s<br>', $buy_per_unit, $sell_per_unit, $recipe['alias'] );
					}
				}
//				printf('Setting buy (%s), sell (%s) for %s<br>', $buy, $sell, $item['alias'] );
				$item['buy'] = (float)($buy / $item['quantity']);
				$item['sell'] = (float)($sell / $item['quantity']);
				// cache the price, so future recursion isn't necessary
				$this->_json[$alias]['buy'] = $item['buy'];
				$this->_json[$alias]['sell'] = $item['sell'];
			} else {
				// Override all buy prices that are built in
				if(strpos($item['name'], 'wool') === false){
					$item['buy'] = (float)($item['sell'] * .35);
				}
			}
			return $item;
		}
		return null;
	}
}