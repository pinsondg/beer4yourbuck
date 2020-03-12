// import React from "react";
// import {Beer} from "../../model/Beer";
// import {Button, Form, Modal, ModalBody, ModalHeader} from "reactstrap";
// import BeerSearcher from "../input/beer-searcher/BeerSearcher";
// import ABVInput from "../input/apv-input/ABVInput";
// import CostInput from "../input/cost-input/CostInput";
// import VolumeInput from "../input/volume-input/VolumeInput";
// import {CalculationItemInput} from "./BeerAddModal";
//
// interface Props {
//     beer: Beer;
//     onBeerEdited: (beer: Beer) => void
// }
//
// export function BeerEditModal(props: Props) {
//
//
//     return (
//         <Modal isOpen={isOpen} toggle={toggle}>
//             <ModalHeader toggle={toggle}>Edit Beer</ModalHeader>
//             <ModalBody>
//                 <Form>
//                     <BeerSearcher
//                         getSelected={onBeerSelected}
//                         onBeerSwitch={onBeerSwitch}
//                         focused={focusedInput === CalculationItemInput.BEER_NAME}
//                         onFocus={() => setFocusedInput(CalculationItemInput.BEER_NAME)}
//                         getName={name => setBeerName(name)}
//                         text={beerName}
//                     />
//                     <ABVInput
//                         text={apvInput ? apvInput.toString() : ''}
//                         getVal={val => setApvInput(+val)}
//                         locked={false}
//                     />
//                     <CostInput
//                         getCost={getCost}
//                         text={cost ? cost.toString() : ''}
//                         error={inputErrors.beerError}
//                     />
//                     <VolumeInput
//                         getVolume={getVolume}
//                         text={volume ? volume.toString() : ''}
//                         error={inputErrors.volumeError}
//                     />
//                     <Button onClick={}>Edit</Button>
//                 </Form>
//             </ModalBody>
//         </Modal>
//     )
// }

export function Item() {
    
}