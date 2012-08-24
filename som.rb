require 'rubygems'
require 'ai4r'
#require './data/data'


class SomRecognizer

    def initialize( data, length, log )
        @data = data
        
        @som = Ai4r::Som::Som.new( 35, 8, Ai4r::Som::Layer.new( 64, 3 ) )
        @som.initiate_map
        if log then puts "global_error", @som.global_error( SOM_DATA ) end


        if log then puts 'Training started...' end
        @som.train( @data )
        if log then puts '...finished' end

        @neurons = (0..11).map { |i| @som.find_bmu( @data[i*length] )[0] }
        
        if log then puts "globalerror", @som.global_error( @data ) end

    end

    def recognize( d )
        min_d = 1000 # some very large number
        node = nil
        index = 0
        
        @neurons.each_with_index do |n, i|
            if min_d >= n.distance_to_input( d ) then
                node = n
                min_d = node.distance_to_input( d ) # plain stupid
                index = i
            end
        end 
        
        return index 
    end

end
