import { useState } from 'react';
import { useGetHealthData } from '../hooks/useGetHealthData';
import { useLogHealthData } from '../hooks/useLogHealthData';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Activity, Droplet, Moon, Pill, Utensils, Plus, Trash2, Loader2, CheckCircle2 } from 'lucide-react';

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

  const addMeal = () => setMeals([...meals, '']);
  const removeMeal = (index: number) => setMeals(meals.filter((_, i) => i !== index));
  const updateMeal = (index: number, value: string) => {
    const newMeals = [...meals];
    newMeals[index] = value;
    setMeals(newMeals);
  };

  const addMedication = () => setMedications([...medications, { name: '', dosage: '', time: '' }]);
  const removeMedication = (index: number) => setMedications(medications.filter((_, i) => i !== index));
  const updateMedication = (index: number, field: 'name' | 'dosage' | 'time', value: string) => {
    const newMedications = [...medications];
    newMedications[index][field] = value;
    setMedications(newMedications);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredMeals = meals.filter(m => m.trim());
    const filteredMedications = medications.filter(m => m.name.trim() && m.dosage.trim() && m.time.trim());

    logHealthData({
      exerciseMinutes: BigInt(exerciseMinutes || '0'),
      meals: filteredMeals,
      waterIntake: BigInt(waterIntake || '0'),
      sleepHours: BigInt(sleepHours || '0'),
      medications: filteredMedications
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Current Health Data Display */}
      {healthData && (
        <Card className="shadow-soft border-l-4 border-l-primary">
          <CardHeader className="border-b bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-semibold">Current Health Data</CardTitle>
                <CardDescription className="font-normal">Your latest tracked wellness metrics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm font-medium">Exercise</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{healthData.exerciseMinutes.toString()} minutes</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Droplet className="w-4 h-4" />
                  <span className="text-sm font-medium">Water Intake</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{healthData.waterIntake.toString()} glasses</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Moon className="w-4 h-4" />
                  <span className="text-sm font-medium">Sleep</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{healthData.sleepHours.toString()} hours</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Utensils className="w-4 h-4" />
                  <span className="text-sm font-medium">Meals</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{healthData.meals.length} logged</p>
              </div>
            </div>

            {healthData.meals.length > 0 && (
              <>
                <Separator className="my-6" />
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                    <Utensils className="w-4 h-4" />
                    Meals Today
                  </h4>
                  <ul className="space-y-2">
                    {healthData.meals.map((meal, index) => (
                      <li key={index} className="text-sm text-foreground bg-muted/50 px-4 py-2.5 rounded-lg font-normal">
                        {meal}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {healthData.medications.length > 0 && (
              <>
                <Separator className="my-6" />
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    Medications
                  </h4>
                  <div className="space-y-2">
                    {healthData.medications.map((med, index) => (
                      <div key={index} className="text-sm bg-muted/50 px-4 py-3 rounded-lg space-y-1">
                        <p className="font-semibold text-foreground">{med.name}</p>
                        <p className="text-muted-foreground font-normal">
                          {med.dosage} at {med.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Log New Health Data Form */}
      <Card className="shadow-soft">
        <CardHeader className="border-b bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-semibold">Log Health Data</CardTitle>
              <CardDescription className="font-normal">Track your daily wellness activities</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exercise */}
            <div className="space-y-2.5">
              <Label htmlFor="exercise" className="flex items-center gap-2 font-medium text-sm">
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
                className="h-11 border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
              />
            </div>

            {/* Meals */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-medium text-sm">
                <Utensils className="w-4 h-4 text-primary" />
                Meals
              </Label>
              {meals.map((meal, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g., Oatmeal with berries"
                    value={meal}
                    onChange={(e) => updateMeal(index, e.target.value)}
                    disabled={isPending}
                    className="h-11 border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
                  />
                  {meals.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeMeal(index)}
                      disabled={isPending}
                      className="h-11 w-11 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all"
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
                onClick={addMeal}
                disabled={isPending}
                className="w-full rounded-lg hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Meal
              </Button>
            </div>

            {/* Water Intake */}
            <div className="space-y-2.5">
              <Label htmlFor="water" className="flex items-center gap-2 font-medium text-sm">
                <Droplet className="w-4 h-4 text-primary" />
                Water Intake (glasses)
              </Label>
              <Input
                id="water"
                type="number"
                min="0"
                placeholder="8"
                value={waterIntake}
                onChange={(e) => setWaterIntake(e.target.value)}
                disabled={isPending}
                className="h-11 border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
              />
            </div>

            {/* Sleep */}
            <div className="space-y-2.5">
              <Label htmlFor="sleep" className="flex items-center gap-2 font-medium text-sm">
                <Moon className="w-4 h-4 text-primary" />
                Sleep (hours)
              </Label>
              <Input
                id="sleep"
                type="number"
                min="0"
                max="24"
                step="0.5"
                placeholder="7.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                disabled={isPending}
                className="h-11 border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
              />
            </div>

            {/* Medications */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-medium text-sm">
                <Pill className="w-4 h-4 text-primary" />
                Medications
              </Label>
              {medications.map((med, index) => (
                <div key={index} className="space-y-2 p-4 border border-border rounded-xl bg-muted/30">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Medication name"
                      value={med.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                      disabled={isPending}
                      className="h-10 border-input focus:ring-2 focus:ring-ring transition-all"
                    />
                    {medications.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeMedication(index)}
                        disabled={isPending}
                        className="h-10 w-10 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="text"
                      placeholder="Dosage (e.g., 10mg)"
                      value={med.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      disabled={isPending}
                      className="h-10 border-input focus:ring-2 focus:ring-ring transition-all"
                    />
                    <Input
                      type="text"
                      placeholder="Time (e.g., 8:00 AM)"
                      value={med.time}
                      onChange={(e) => updateMedication(index, 'time', e.target.value)}
                      disabled={isPending}
                      className="h-10 border-input focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMedication}
                disabled={isPending}
                className="w-full rounded-lg hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </div>

            <Separator className="my-6" />

            <Button
              type="submit"
              className="w-full h-12 rounded-lg shadow-soft hover:shadow-md transition-all duration-200 font-medium text-base"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging Data...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-5 w-5" />
                  Log Health Data
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
