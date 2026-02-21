import { useState } from 'react';
import { useGetHealthData } from '../hooks/useGetHealthData';
import { useLogHealthData } from '../hooks/useLogHealthData';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Activity, Droplet, Moon, Pill, Utensils, Plus, Trash2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function HealthRoutineTracker() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  
  const { data: healthData, isLoading, error } = useGetHealthData(principal);
  const { mutate: logHealthData, isPending } = useLogHealthData();

  const [exerciseMinutes, setExerciseMinutes] = useState('');
  const [meals, setMeals] = useState<string[]>(['']);
  const [waterIntake, setWaterIntake] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [medications, setMedications] = useState<Array<{ name: string; dosage: string; time: string }>>([
    { name: '', dosage: '', time: '' }
  ]);

  const handleAddMeal = () => {
    setMeals([...meals, '']);
  };

  const handleRemoveMeal = (index: number) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const handleMealChange = (index: number, value: string) => {
    const newMeals = [...meals];
    newMeals[index] = value;
    setMeals(newMeals);
  };

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', time: '' }]);
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedicationChange = (index: number, field: 'name' | 'dosage' | 'time', value: string) => {
    const newMedications = [...medications];
    newMedications[index][field] = value;
    setMedications(newMedications);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredMeals = meals.filter(m => m.trim());
    const filteredMedications = medications.filter(m => m.name.trim());

    logHealthData({
      exerciseMinutes: BigInt(exerciseMinutes || 0),
      meals: filteredMeals,
      waterIntake: BigInt(waterIntake || 0),
      sleepHours: BigInt(sleepHours || 0),
      medications: filteredMedications
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Current Data Display */}
      {healthData && (
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Your Current Health Data
            </CardTitle>
            <CardDescription>Last logged health routine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  Exercise
                </p>
                <p className="text-2xl font-bold text-foreground">{Number(healthData.exerciseMinutes)} min</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Droplet className="w-4 h-4" />
                  Water
                </p>
                <p className="text-2xl font-bold text-foreground">{Number(healthData.waterIntake)} ml</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Moon className="w-4 h-4" />
                  Sleep
                </p>
                <p className="text-2xl font-bold text-foreground">{Number(healthData.sleepHours)} hrs</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Utensils className="w-4 h-4" />
                  Meals
                </p>
                <p className="text-2xl font-bold text-foreground">{healthData.meals.length}</p>
              </div>
            </div>
            {healthData.medications.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Pill className="w-4 h-4" />
                    Medications
                  </p>
                  <div className="space-y-1">
                    {healthData.medications.map((med, idx) => (
                      <p key={idx} className="text-sm text-foreground">
                        {med.name} - {med.dosage} at {med.time}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {error && !healthData && (
        <Alert>
          <AlertDescription>
            No health data logged yet. Start tracking your wellness routine below!
          </AlertDescription>
        </Alert>
      )}

      {/* Log New Data Form */}
      <Card>
        <CardHeader>
          <CardTitle>Log Today's Health Routine</CardTitle>
          <CardDescription>Track your daily wellness activities</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exercise */}
            <div className="space-y-2">
              <Label htmlFor="exercise" className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Exercise (minutes)
              </Label>
              <Input
                id="exercise"
                type="number"
                min="0"
                placeholder="30"
                value={exerciseMinutes}
                onChange={(e) => setExerciseMinutes(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Water Intake */}
            <div className="space-y-2">
              <Label htmlFor="water" className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-primary" />
                Water Intake (ml)
              </Label>
              <Input
                id="water"
                type="number"
                min="0"
                placeholder="2000"
                value={waterIntake}
                onChange={(e) => setWaterIntake(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Sleep Hours */}
            <div className="space-y-2">
              <Label htmlFor="sleep" className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-primary" />
                Sleep (hours)
              </Label>
              <Input
                id="sleep"
                type="number"
                min="0"
                max="24"
                placeholder="8"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                disabled={isPending}
              />
            </div>

            <Separator />

            {/* Meals */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-primary" />
                Meals
              </Label>
              {meals.map((meal, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Meal ${index + 1} (e.g., Oatmeal with berries)`}
                    value={meal}
                    onChange={(e) => handleMealChange(index, e.target.value)}
                    disabled={isPending}
                  />
                  {meals.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveMeal(index)}
                      disabled={isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMeal}
                disabled={isPending}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Meal
              </Button>
            </div>

            <Separator />

            {/* Medications */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-primary" />
                Medications
              </Label>
              {medications.map((med, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg bg-muted/30">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Medication name"
                      value={med.name}
                      onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                      disabled={isPending}
                    />
                    {medications.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveMedication(index)}
                        disabled={isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Dosage (e.g., 500mg)"
                      value={med.dosage}
                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                      disabled={isPending}
                    />
                    <Input
                      placeholder="Time (e.g., 8:00 AM)"
                      value={med.time}
                      onChange={(e) => handleMedicationChange(index, 'time', e.target.value)}
                      disabled={isPending}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMedication}
                disabled={isPending}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging...
                </>
              ) : (
                'Log Health Data'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

