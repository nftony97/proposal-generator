import React from 'react';
import {
  CheckCircle2, AlertCircle, RefreshCw, RefreshCw as LoopIcon,
  Plus, Trash2, Upload, FileText, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CENSUS_PARSER_OUTPUT, QUOTE_EXTRACTOR_OUTPUT, VALIDATOR_OUTPUT
} from '../../const';
import type { AgentStep } from '../../const';

interface PipelineWorkspaceProps {
  steps: AgentStep[];
  selectedStep: AgentStep;
  setSelectedStep: (step: AgentStep) => void;
  uploadedStyleFile: string | null;
  isExtractingPattern: boolean;
  customStyles: { primaryColor: string; headingClass: string };
  handleDragStart: (id: number) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (id: number) => void;
  addStep: () => void;
  deleteStep: (id: number, e: React.MouseEvent) => void;
  handleStepNameChange: (id: number, name: string) => void;
  handleUploadStyle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PipelineWorkspace({
  steps, selectedStep, setSelectedStep,
  uploadedStyleFile, isExtractingPattern,
  customStyles,
  handleDragStart, handleDragOver, handleDrop,
  addStep, deleteStep, handleStepNameChange, handleUploadStyle,
}: PipelineWorkspaceProps) {
  return (
    <div className="lg:col-span-4 space-y-6">

      {/* Pipeline Tracker Card */}
      <Card className="shadow-sm border-border/60 bg-white/90">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`text-base font-bold tracking-tight ${customStyles.headingClass}`}>
                Orchestrator Workflow
              </CardTitle>
              <CardDescription className="text-xs">
                Drag steps to modify sequence. Click to view telemetry.
              </CardDescription>
            </div>
            <Button
              variant="outline" size="icon"
              onClick={addStep}
              className="h-8 w-8 text-primary"
              style={{ color: customStyles.primaryColor }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              draggable
              onDragStart={() => handleDragStart(step.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(step.id)}
              onClick={() => setSelectedStep(step)}
              className={`group relative flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 active:scale-[0.99] ${
                selectedStep.id === step.id
                  ? 'border-primary/80 bg-primary/[0.03] shadow-sm'
                  : 'border-border/50 bg-white hover:border-border hover:bg-muted/10'
              }`}
            >
              <div className="flex flex-col items-center mt-0.5">
                <span className="text-[10px] font-bold text-muted-foreground mb-1">{step.agentName}</span>
                {step.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-emerald-600 bg-emerald-50 rounded-full" />}
                {step.status === 'running'   && <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />}
                {step.status === 'warning'   && <AlertCircle className="h-5 w-5 text-amber-500" />}
                {step.status === 'pending'   && <div className="h-5 w-5 rounded-full border-2 border-dashed border-muted-foreground/30" />}
              </div>

              <div className="flex-1 space-y-1 pr-6">
                <input
                  type="text"
                  value={step.name}
                  onChange={(e) => handleStepNameChange(step.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="font-semibold text-xs bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary/40 rounded px-1 -ml-1 w-full text-foreground"
                />
                <p className="text-[11px] text-muted-foreground line-clamp-1">{step.description}</p>
              </div>

              <button
                onClick={(e) => deleteStep(step.id, e)}
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity p-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Style Reference Upload Card */}
      <Card className="shadow-sm border-border/60 bg-white/90">
        <CardHeader className="pb-4">
          <CardTitle className={`text-base font-bold tracking-tight ${customStyles.headingClass}`}>
            Style Reference Upload
          </CardTitle>
          <CardDescription className="text-xs">
            Upload your desired PDF/PPTX standard. The agent extracts layout rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 hover:border-primary/50 rounded-xl p-4 text-center cursor-pointer transition-colors relative">
            <input
              type="file"
              accept=".pdf,.pptx"
              onChange={handleUploadStyle}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isExtractingPattern}
            />
            {isExtractingPattern ? (
              <div className="space-y-2 py-2">
                <LoopIcon className="h-6 w-6 text-primary animate-spin mx-auto" style={{ color: customStyles.primaryColor }} />
                <p className="text-xs font-semibold text-foreground">Extracting design tokens & layout grids...</p>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                <Upload className="h-6 w-6 text-muted-foreground mx-auto" />
                <p className="text-xs font-semibold text-foreground">Click to upload reference standard</p>
                <p className="text-[10px] text-muted-foreground">PDF or PPTX slides</p>
              </div>
            )}
          </div>

          {uploadedStyleFile && (
            <div className="p-3 bg-emerald-50 border border-emerald-200/50 rounded-lg flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold">Active Design Pattern:</div>
                <div className="font-mono text-[10px] break-all">{uploadedStyleFile}</div>
                <div className="text-[10px] text-emerald-700/80">
                  ✓ Geometric grids extracted<br />
                  ✓ Color palette matching enabled<br />
                  ✓ Header/Footer styling mapped
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Telemetry Card */}
      <Card className="shadow-sm border-border/60 bg-white/95 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" style={{ backgroundColor: customStyles.primaryColor }} />
        <CardHeader className="pb-3 border-b border-border/40 pl-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold" style={{ color: customStyles.primaryColor }}>
                {selectedStep.agentName}
              </Badge>
              <CardTitle className={`text-base font-bold tracking-tight ${customStyles.headingClass}`}>
                {selectedStep.name} Telemetry
              </CardTitle>
            </div>
            {selectedStep.outputFile && (
              <Badge className="bg-muted text-muted-foreground hover:bg-muted border flex items-center gap-1 text-xs">
                <FileText className="h-3 w-3" />
                {selectedStep.outputFile}
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs">
            {selectedStep.description} Live state logs and structured outputs below.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pl-8 space-y-6">

          {selectedStep.id === 1 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Normalized Census Parser Outputs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border/40 rounded-lg p-4 bg-muted/10 space-y-3">
                  <div className="text-xs font-bold text-foreground border-b border-border/40 pb-1.5">Group Enrollment Demographics</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span>Client Name:</span><span className="font-semibold">{CENSUS_PARSER_OUTPUT.client_name}</span></div>
                    <div className="flex justify-between"><span>Census Date:</span><span className="font-semibold">{CENSUS_PARSER_OUTPUT.census_date}</span></div>
                    <div className="flex justify-between"><span>Total Eligible:</span><span className="font-semibold">{CENSUS_PARSER_OUTPUT.total_eligible_employees}</span></div>
                    <div className="flex justify-between"><span>Total Enrolled:</span><span className="font-semibold">{CENSUS_PARSER_OUTPUT.total_enrolled_employees}</span></div>
                    <div className="flex justify-between"><span>Average Age:</span><span className="font-semibold">{CENSUS_PARSER_OUTPUT.demographics.average_age} yrs</span></div>
                  </div>
                </div>
                <div className="border border-border/40 rounded-lg p-4 bg-muted/10 space-y-3">
                  <div className="text-xs font-bold text-foreground border-b border-border/40 pb-1.5">Enrollment by Tier Counts</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-medium text-muted-foreground border-b border-border/20 pb-1">
                      <span>Benefit</span><span>EE</span><span>ES</span><span>EC</span><span>EF</span>
                    </div>
                    {(['medical','dental','vision'] as const).map(b => (
                      <div key={b} className="flex justify-between">
                        <span className="font-medium capitalize">{b}:</span>
                        <span>{CENSUS_PARSER_OUTPUT.enrollment_by_benefit[b].ee}</span>
                        <span>{CENSUS_PARSER_OUTPUT.enrollment_by_benefit[b].es}</span>
                        <span>{CENSUS_PARSER_OUTPUT.enrollment_by_benefit[b].ec}</span>
                        <span>{CENSUS_PARSER_OUTPUT.enrollment_by_benefit[b].ef}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {CENSUS_PARSER_OUTPUT.flags.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200/50 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div><span className="font-bold">Census Flag:</span> {CENSUS_PARSER_OUTPUT.flags[0]}</div>
                </div>
              )}
            </div>
          )}

          {selectedStep.id === 2 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Extracted Carrier Quote Rates</h4>
              {QUOTE_EXTRACTOR_OUTPUT.map((quote, idx) => (
                <div key={idx} className="border border-border/40 rounded-lg p-4 bg-muted/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground font-bold" style={{ backgroundColor: customStyles.primaryColor }}>
                        {quote.carrier}
                      </Badge>
                      <span className="text-xs font-bold text-foreground">{quote.plan_name} ({quote.benefit_type.toUpperCase()})</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: customStyles.primaryColor }}>
                      Total Premium: ${quote.total_monthly_premium.toLocaleString('en-US', { minimumFractionDigits: 2 })}/mo
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div><span className="text-muted-foreground block text-[10px] uppercase">Deductible (Ind/Fam)</span><span className="font-semibold">${quote.plan_features.deductible_individual} / ${quote.plan_features.deductible_family}</span></div>
                    <div><span className="text-muted-foreground block text-[10px] uppercase">Employer Contribution</span><span className="font-semibold">{quote.employer_contribution}</span></div>
                    <div><span className="text-muted-foreground block text-[10px] uppercase">Rate Guarantee</span><span className="font-semibold">{quote.rate_guarantee}</span></div>
                    <div><span className="text-muted-foreground block text-[10px] uppercase">Source PDF Page</span><span className="font-semibold">{quote.source_page}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedStep.id === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Validator & Audit Mathematical Verification</h4>
                <Badge className="bg-amber-100 border border-amber-200 text-amber-800 flex items-center gap-1 font-bold">
                  <AlertCircle className="h-3 w-3" />WARN
                </Badge>
              </div>
              <div className="border border-border/40 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border/40 text-muted-foreground font-bold">
                      <th className="p-3">Severity</th><th className="p-3">Plan Affected</th>
                      <th className="p-3">Description</th><th className="p-3">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VALIDATOR_OUTPUT.findings.map((finding, idx) => (
                      <tr key={idx} className="border-b border-border/20 last:border-0 hover:bg-muted/5">
                        <td className="p-3 font-bold">
                          <Badge className={finding.severity === 'ERROR' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-amber-100 text-amber-800 border-amber-200'}>
                            {finding.severity}
                          </Badge>
                        </td>
                        <td className="p-3 font-semibold text-foreground">{finding.plan_affected}</td>
                        <td className="p-3 text-muted-foreground leading-relaxed">{finding.description}</td>
                        <td className="p-3 text-primary font-medium" style={{ color: customStyles.primaryColor }}>{finding.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border border-border/40 rounded-lg p-4 bg-muted/10 space-y-3">
                <div className="text-xs font-bold text-foreground border-b border-border/40 pb-1.5">Enrollment Reconciliation Notes</div>
                <p className="text-xs text-muted-foreground leading-relaxed italic">"{VALIDATOR_OUTPUT.enrollment_reconciliation.note}"</p>
                <div className="grid grid-cols-3 gap-4 pt-1 text-xs">
                  <div><span className="text-muted-foreground block text-[10px] uppercase">Medical Basis</span><span className="font-semibold">48 lives (24/8/6/10)</span></div>
                  <div><span className="text-muted-foreground block text-[10px] uppercase">Dental Basis</span><span className="font-semibold">40 lives (20/5/8/7)</span></div>
                  <div><span className="text-muted-foreground block text-[10px] uppercase">Normalization Method</span><span className="font-semibold" style={{ color: customStyles.primaryColor }}>{VALIDATOR_OUTPUT.enrollment_reconciliation.normalization_method}</span></div>
                </div>
              </div>
            </div>
          )}

          {selectedStep.id === 4 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Proposal Generation State</h4>
              <div className="p-4 border border-dashed border-slate-200 rounded-lg bg-slate-50 text-center space-y-2 py-8">
                <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto" style={{ color: customStyles.primaryColor }} />
                <h5 className="text-xs font-bold text-foreground">Orchestrator Compiling Output Decks</h5>
                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                  Applying extracted design tokens from reference template onto normalized census data and active carrier rates.
                </p>
              </div>
            </div>
          )}

          {selectedStep.id === 5 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quality Control Post-Generation Check</h4>
              <div className="border border-border/40 rounded-lg p-5 bg-muted/10 flex flex-col items-center justify-center text-center py-10 space-y-3">
                <HelpCircle className="h-10 w-10 text-muted-foreground/50" />
                <div>
                  <h5 className="text-sm font-bold text-foreground">Waiting for Proposal Generation</h5>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1">
                    Once AGENT 4 completes the slide presentation, the QC agent will run mathematical verification and data traceability checks.
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-xs" disabled>Awaiting Pipeline</Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

    </div>
  );
}
