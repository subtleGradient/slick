<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" debug="true">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	
	<script type="text/javascript" src="../frameworks/<?php echo $_GET['include']; ?>"></script>
	
	<script type="text/javascript">
		
		var get_length = function(elements){
			return (typeof elements.length == 'function') ? elements.length() : elements.length;
		}
	
		var el = document.createElement('span');
		document.appendChild(el);
		
		function test(selector){
			try {
				var times = [];
				var start = new Date().getTime();
				var i = 0;
				
				
				el.innerHTML='';
				times[i]={ start:new Date() };
				var elements = <?php echo $_GET['function']; ?>(selector);
				times[i].end = new Date();
				el.innerHTML='<span></span>';
				
				//var step = (new Date().getTime() - start);
				//if (step > 750) return {'time': step, 'found': get_length(elements)};
				
				times[++i]={ start:new Date() }; <?php echo $_GET['function']; ?>(selector+' ');times[i].end = new Date();el.innerHTML+='<span></span>';
				times[++i]={ start:new Date() }; <?php echo $_GET['function']; ?>(selector+'  ');times[i].end = new Date();el.innerHTML+='<span></span>';
				times[++i]={ start:new Date() }; <?php echo $_GET['function']; ?>(selector+'   ');times[i].end = new Date();el.innerHTML+='<span></span>';
				times[++i]={ start:new Date() }; <?php echo $_GET['function']; ?>(selector+'    ');times[i].end = new Date();el.innerHTML+='<span></span>';
				times[++i]={ start:new Date() }; <?php echo $_GET['function']; ?>(selector+'     ');times[i].end = new Date();el.innerHTML+='<span></span>';
				times[++i]={ start:new Date() }; <?php echo $_GET['function']; ?>(selector+'      ');times[i].end = new Date();el.innerHTML+='<span></span>';
				times[++i]={ start:new Date() }; <?php echo $_GET['function']; ?>(selector+'       ');times[i].end = new Date();el.innerHTML+='<span></span>';
				times[++i]={ start:new Date() }; <?php echo $_GET['function']; ?>(selector+'        ');times[i].end = new Date();el.innerHTML+='<span></span>';
				times[++i]={ start:new Date() }; <?php echo $_GET['function']; ?>(selector+'         ');times[i].end = new Date();el.innerHTML+='<span></span>';
				
				var end = (new Date().getTime() - start);
				// return {'time': Math.round(end)/10, 'found': get_length(elements)};
				
				var data = { time:0, found:get_length(elements) };
				
				for (var N=0; N < times.length; N++) {
					if (!times[N]) continue;
					data.time += (times[N].end - times[N].start);
				}
				data.time && (data.time /= times.length);
				data.time || (data.time=0);
				
				return data;
			} catch(err){
				if (elements == undefined) elements = {length: -1};
				return ({'time': ((new Date().getTime() - start) / (i||1)) || 0, 'found': get_length(elements), 'error': err});
			}

		};
	
	</script>
	
</head>

<body>
	
	<?php include('../template.html');?>

</body>
</html>
