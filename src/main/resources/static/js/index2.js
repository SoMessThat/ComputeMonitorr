$.ajax({
	url:'/getSession',
	type:'get',
	dataType:'text',
	data:{
		'key':'userID',
	},
	error:function (res) {
		alert(res);
	},
	success:function (res) {
		alert(res);
	}
});