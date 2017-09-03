<?php
namespace CaF;


class SystemCommand {
	private $commandString = '';
	private $commandOutput = [];
	private $resultCode = 255;


	public function __construct($commandString = null) {
		if ($commandString != null) { $this->commandString = $commandString; }
	}


	public function bindParam($parameter, $variable, $length = null) {

		$this->commandString = str_replace(
			$parameter,
			($length == null) ? $variable : substr($variable, 0, $length),
			$this->commandString
		);

		return $this;
	}


	public function execute() {
		exec($this->commandString, $this->commandOutput, $this->resultCode);
		// print 'Executed: ' . $this->commandString . "\n";
		// print ' - result: ' . $this->resultCode . "\n";
		// print ' - output: ' . print_r($this->commandOutput, true) . "\n";
		return $this;
	}


	public function getCommandOutput() {
		return $this->commandOutput;
	}


	public function getCommandString() {
		return $this->commandString;
	}


	public function setCommandString($commandString) {
		$this->commandString = $commandString;
		return $this;
	}

}
