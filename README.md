# StaffOS

Skill para agentes de IA que obliga a programar con criterio profesional.

Inspirado en la idea de escribir menos código, pero agregando:

- Validación técnica.
- Seguridad obligatoria.
- Documentación continua.
- Trabajo por fases.
- Revisión anti-slop.
- Uso de documentación actualizada.
- Handoff para otros agentes.

## Objetivo

Evitar que los agentes de IA produzcan código inflado, inseguro o difícil de mantener.

## Instalación manual

Copiar:

```txt
skills/staffos/SKILL.md
AGENTS.md
commands/
docs/
```

al proyecto donde trabajará el agente.

## Uso

Antes de iniciar una tarea, el agente debe leer:

```txt
AGENTS.md
skills/staffos/SKILL.md
docs/AI_CONTEXT.md
docs/HANDOFF.md
```

## Comandos

* staffos-review
* staffos-audit
* staffos-security
* staffos-handoff
* staffos-help

## Licencia

MIT
