require 'rubygems'
require 'ai4r'
#require './data/data'


class MultilayerRecognizer

    def initialize( data, length, log )
        net = Ai4r::NeuralNetwork::Backpropagation.new([35, 30, 12])

        # Train the network
        for i in 0..data.length-1
            result = [0,0,0,0,0,0,0,0,0,0,0,0]
            result[i/length] = 1
            net.train( data[i] , result )
        end
    end
    
    
    def recognize( d )
        result = net.eval( d )

        index = 0
        for i in 0..result.lenght do
            if result[i] == 1 then index = i end 
        end

        return index
    end

end
