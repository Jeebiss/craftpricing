<!doctype html>
<html>
	<head>
		<title>CraftPricing</title>
	</head>
	<body>
		
		<?php require('Craftpricing.php');
		
		$cp = new Craftpricing();
		$items = $cp->generate();
		
		?>
		
		TRUNCATE TABLE `craftys_products`;<br>
		
		<?php if($items): foreach($items as $item): ?>
		INSERT INTO `craftys_products` (`item_id`, `sub_id`, `alias`, `item`, `buy_price`, `sell_price`, `allows_user_sale`) VALUES ("<?= $item['item_id'] ?>","<?= $item['sub_id'] ?>",'"<?= $item['alias'] ?>"','"<?= $item['name'] ?>"',<?= $item['buy'] ?>,<?= $item['sell'] ?>,1);<br>
		<?php endforeach; endif; ?>
	</body>
</html>