
function counter(state, action)
{
	if (typeof state === 'undefined') return 0;

	// console.log('action');
	// console.log(state);
	// console.log(action);
	console.log('xxxxxxxxxxxxx');

	switch(action.type) {
		case 'PLUS':
			state += 1;
			break;
		case 'MINUS':
			state -= 1;
			break;
		default:
			break;
	}

	return state;
}

var store = Redux.createStore(counter);

function render()
{
	document.getElementById('num').value = store.getState();
	console.log('render');
	console.log(store.getState());
	console.log('----------------');
}

render();
store.subscribe(render);


document.getElementById('btnPlus').addEventListener('click', function(){
	store.dispatch({ type: 'PLUS' });
});
document.getElementById('btnMinus').addEventListener('click', function(){
	store.dispatch({ type: 'MINUS' });
});