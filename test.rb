require 'rubygems'
require 'ai4r'
require './data/data'


class Recognizer

    def initialize
        @som = Ai4r::Som::Som.new( 35, 8, Ai4r::Som::Layer.new( 64, 3 ) )
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
            @neurons.push node
            print node, " { x : ", node.x, " , y : ",  node.y, " } -> ",  distance, "\n"
        end 
        
        puts "globalerror", @som.global_error( SOM_DATA )
    end

    def recognize( d )
        min_d = 1000 # some very large number
        node = nil
        index = 0
        
        @neuons.each_with_index do |n, i|
            if min_d >= n.distance_to_input( d ) then
                node = n
                min_d = node.distance_to_input( d ) # plain stupid
                index = i
            end
        end 
        
        return index 
    end

end


