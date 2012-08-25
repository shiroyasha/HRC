require 'rubygems'
require 'ai4r'
#require './data/data'


class MultilayerRecognizer

    def initialize( data, length, log )
        @net = Ai4r::NeuralNetwork::Backpropagation.new([35, 50, 12])
        @net.init_network()

        # Train the network
        for i in 0..data.length-1
            result = [0,0,0,0,0,0,0,0,0,0,0,0]
            puts i/12
            result[i/12] = 1

            @net.train( data[i] , result )
        end
    end
    
    
    def recognize( d )
        result = @net.eval( d )
        print 'out', result
        index = 2
        for i in 0..result.length do
            if result[i] == 1 then index = i end 
        end

        return index
    end

end
