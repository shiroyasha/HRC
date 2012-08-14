require 'rubygems'
require 'ai4r'
require './data/data'


class Recognizer

    def initialize
        @som = Ai4r::Som::Som.new( 140, 8, Ai4r::Som::Layer.new( 64, 3 ) )
        @som.initiate_map
        puts "global_error", @som.global_error( SOM_DATA )


        puts 'Training started...'
        @som.train( SOM_DATA )
        puts '...finished'


        @neurons = Array.new

        #for i in 0..3 do
        #    for j in 0..3 do
        #        print i, " ", j , " -> ", @som.get_node( i, j ).weights, "\n"
        #    end
        #end

        for d in SOM_DATA do
            node, distance =  @som.find_bmu( d )
            print node, " { x : ", node.x, " , y : ",  node.y, " } -> ",  distance, "\n"
        end 
        
        puts "globalerror", @som.global_error( SOM_DATA )
    end

    def recognize( d )
        
        rez = @som.find_bmu( d )
        #puts "rez", rez
        i = 0

        while i < @neurons.length
            if rez == @neurons[i] then return i end
            i = i + 1
        end
        
        return nil
    end

end


r = Recognizer.new
