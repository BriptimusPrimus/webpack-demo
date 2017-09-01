import Worker from 'worker-loader!./worker';

export default () => {
	const element = document.createElement('h1');
	const worker = new Worker();
	const state = { text: 'foo' };

	worker.addEventListener(
		'message',
		({ data: { text } }) => {
			state.text = text;
			element.innerHTML = text;
		}
	);

	element.innerHTML = state.text;
	element.onclick = () => worker.postMessage({ text: state.text });

	// element.onclick = () => {
	// 	import('./lazy').then((lazy) => {
	// 		element.textContent = lazy.default;
	// 	}).catch((err) => {
	// 		console.log(err);
	// 	});
	// };

	return element;
};
