import React, { useState } from 'react';
import Button from '../../components/Button';
import Select from '../../components/Select';
import TopSearch from '../../components/TopSearch';

const Phase: React.FC = () => {
  const [phaseOptions] = useState<string[]>(['Pre', 'During', 'Post']);
  const [selectedPhase, setSelectedPhase] = useState('');
  const [addedPhases, setAddedPhases] = useState<string[]>([]);

  const handleAddPhase = () => {
    if (selectedPhase && !addedPhases.includes(selectedPhase)) {
      setAddedPhases([...addedPhases, selectedPhase]);
      setSelectedPhase('');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-start gap-2">
        <TopSearch 
          onSearch={() => {}} 
          onButtonClick={() => {}} 
          buttons={[]} 
        />
        <div className="flex items-start gap-5">
          <Select
            name="phase-select"
            label=""
            options={phaseOptions}
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            placeholder="Select Phase"
          />
          <Button label="Add" variant="gray-outline" onClick={handleAddPhase} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {addedPhases.map((phase, index) => (
          <div key={index} className="bg-gray-200 p-3 rounded-md self-start">
            {`Phase: ${phase}`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Phase;
