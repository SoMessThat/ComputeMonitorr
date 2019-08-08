var login = function(){
	$("#userpwd").val(hex_md5($("#userpwd").val()));
	$('#LoginForm').submit();
}
