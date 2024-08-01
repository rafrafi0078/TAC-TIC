import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Avatar } from "antd";

const Container = styled.div`
    border-radius: 10px;
    box-shadow: 5px 5px 5px 2px grey;
    padding: 8px;
    color: #000;
    margin-bottom: 8px;
    min-height: 120px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: ${(props) => bgcolorChange(props)};
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
`;

const TextContent = styled.div``;

const Icons = styled.div`
    display: flex;
    justify-content: end;
    padding: 2px;
`;
function bgcolorChange(props) {
    return props.isDragging
        ? "lightgreen"
        : props.isDraggable
            ? props.isBacklog
                ? "#F2D7D5"
                : "#DCDCDC"
            : props.isBacklog
                ? "#F2D7D5"
                : "#EAF4FC";
}

export default function Card({ task, index }) {
    return (
        <Draggable draggableId={`${task.id}`} key={task.id} index={index}>
            {(provided, snapshot) => (
                <Container
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                >
                    <div style={{ display: "flex", justifyContent: "start", padding: 2 }}>
            <span>
              
            </span>
                    </div>
                    <div
                        style={{ display: "flex", justifyContent: "center", padding: 2 }}
                    >
                        <TextContent>{task?.name}</TextContent>
                    </div>
            
                    <div>Star_Point : {task?.start_point}</div>
                    <div>end_point : {task?.end_point}</div>
                    <div>Descripion : {task?.description}</div>
                    <div>Driver: {task?.user?.name}</div>
                    <div>Car: {task?.vehicle?.make}</div>
                   
                    <div>end_date : {task?.end_date}</div>

                    <Icons>
                    
                        <div>
                            <Avatar
                                onClick={() => console.log(task)}
                                src={"https://joesch.moe/api/v1/random?key=" + task.id}
                            />
                            <small>
                #{task?.id}
                  {"  "}
              </small>
                        </div>
                        
                    </Icons>

                </Container>
            )}
        </Draggable>
    );
}