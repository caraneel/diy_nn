let neuralNetwork;
let submitButton;

function setup() {
  noCanvas();

  let nnOptions = {
    dataUrl: 'data/cereal_clean.csv',
    inputs: ['mfr','type', 'calories', 'sugars'],
    outputs: ['name'],
    task: 'classification',
    debug: true
  };

  neuralNetwork = ml5.neuralNetwork(nnOptions, modelReady)
  submitButton = select('#submit');
  submitButton.mousePressed(classify);
  submitButton.hide();
}

function modelReady() {
  neuralNetwork.normalizeData();
  neuralNetwork.train({ epochs: 70 }, whileTraining, finishedTraining);
}

function whileTraining(epoch, logs) {
  console.log(`Epoch: ${epoch} - loss: ${logs.loss.toFixed(2)}`);
}

function finishedTraining() {
  console.log('done!');
  submitButton.show();
  classify();
}

// TODO: normalize and encode values going into predict?
function classify() {
  let mfr = select('#mfr').value();
  let type = select('#type').value();
  let calories = parseInt(select('#calories').value());
  let sugars = parseInt(select('#sugars').value());

  let inputs = [mfr, type, calories, sugars];
  neuralNetwork.classify(inputs, gotResults);
}

function gotResults(err, results) {
  if (err) {
    console.error(err);
  } else {
    console.log(results);
    select('#result').html(`prediction: ${results[0].label}`);
    classify();
  }
}
